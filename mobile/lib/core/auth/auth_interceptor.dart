import 'package:dio/dio.dart';

import '../../api/generated/clients/auth_client.dart';
import '../../api/generated/models/refresh_token_dto.dart';
import 'token_store.dart';

/// Adds `Authorization: Bearer <access token>` to API calls, and when one comes
/// back 401 (access token expired), exchanges the refresh token for a new pair
/// and retries the request once.
///
/// It is a [QueuedInterceptor]: errors are handled one at a time, so when
/// several requests fail together only the first refreshes; the rest see the
/// new token and just retry.
class AuthInterceptor extends QueuedInterceptor {
  AuthInterceptor({
    required Dio dio,
    required Dio refreshDio,
    required TokenStore tokens,
    required void Function() onSessionExpired,
  }) : _dio = dio,
       _authClient = AuthClient(refreshDio),
       _tokens = tokens,
       _onSessionExpired = onSessionExpired;

  final Dio _dio;
  final AuthClient _authClient;
  final TokenStore _tokens;
  final void Function() _onSessionExpired;

  static const _retriedKey = 'authRetried';

  /// Endpoints that take credentials in the body, not the header. A 401 from
  /// them means wrong password / dead refresh token, never "refresh and retry".
  static const _credentialPaths = {
    '/api/auth/register',
    '/api/auth/token',
    '/api/auth/token/refresh',
    '/api/auth/logout',
  };

  static bool _isCredentialPath(RequestOptions o) =>
      _credentialPaths.contains(o.path);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = _tokens.accessToken;
    if (token != null && !_isCredentialPath(options)) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final request = err.requestOptions;
    final canRefresh =
        err.response?.statusCode == 401 &&
        !_isCredentialPath(request) &&
        request.extra[_retriedKey] != true &&
        _tokens.refreshToken != null;
    if (!canRefresh) return handler.next(err);

    // Another request may have refreshed while this one waited in the queue.
    final sent = request.headers['Authorization'];
    final current = _tokens.accessToken;
    final alreadyRefreshed = current != null && sent != 'Bearer $current';

    if (!alreadyRefreshed) {
      try {
        final pair = await _authClient.refresh(
          body: RefreshTokenDto(refreshToken: _tokens.refreshToken!),
        );
        await _tokens.save(
          access: pair.accessToken,
          refresh: pair.refreshToken,
        );
      } on DioException catch (refreshError) {
        // 401: the refresh token is expired, revoked or reused, so the session
        // is over. Anything else (offline) keeps the tokens for later.
        if (refreshError.response?.statusCode == 401) {
          await _tokens.clear();
          _onSessionExpired();
        }
        return handler.next(err);
      }
    }

    try {
      // A copy: the failed request's options stay as they were sent.
      final retry = request.copyWith(
        headers: {
          ...request.headers,
          'Authorization': 'Bearer ${_tokens.accessToken}',
        },
        extra: {...request.extra, _retriedKey: true},
      );
      handler.resolve(await _dio.fetch<dynamic>(retry));
    } on DioException catch (retryError) {
      handler.next(retryError);
    }
  }
}
