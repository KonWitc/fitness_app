import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../api/generated/models/auth_session_entity.dart';
import '../../api/generated/models/refresh_token_dto.dart';
import '../../api/generated/models/register_dto.dart';
import '../../api/generated/models/sign_in_dto.dart';
import '../../api/generated/models/user_entity.dart';
import '../api.dart';
import 'token_store.dart';

/// The signed-in user: `null` when signed out. Loading at startup while the
/// saved session is checked; an error there means the API was unreachable.
final authControllerProvider =
    AsyncNotifierProvider<AuthController, UserEntity?>(AuthController.new);

/// Changes when a different user signs in (or out), so data providers that
/// watch it refetch instead of showing the previous account's data.
final currentUserIdProvider = Provider<String?>(
  (ref) => ref.watch(authControllerProvider.select((a) => a.value?.id)),
);

class AuthController extends AsyncNotifier<UserEntity?> {
  TokenStore get _tokens => ref.read(tokenStoreProvider);

  @override
  Future<UserEntity?> build() async {
    try {
      await _tokens.load();
      if (_tokens.refreshToken == null) return null;
      // Refreshes the access token first if it expired (AuthInterceptor).
      return await ref.read(apiProvider).auth.me();
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        await _tokens.clear();
        return null;
      }
      rethrow; // offline / server down: the splash screen offers a retry
    } catch (e, st) {
      debugPrint('Session check failed: $e\n$st');
      rethrow;
    }
  }

  /// Throws on failure (wrong password, ...); the form shows the message.
  Future<void> signIn({required String email, required String password}) async {
    final session = await ref
        .read(apiProvider)
        .auth
        .signIn(
          body: SignInDto(email: email, password: password),
        );
    await _start(session);
  }

  Future<void> register({
    required String email,
    required String password,
    String? name,
  }) async {
    final session = await ref
        .read(apiProvider)
        .auth
        .register(
          body: RegisterDto(email: email, password: password, name: name),
        );
    await _start(session);
  }

  Future<void> signOut() async {
    final refreshToken = _tokens.refreshToken;
    await _tokens.clear();
    state = const AsyncData(null);
    if (refreshToken == null) return;
    try {
      // Revoke on the server too; signing out locally already happened.
      await ref
          .read(apiProvider)
          .auth
          .logout(body: RefreshTokenDto(refreshToken: refreshToken));
    } on DioException {
      // Offline: the token expires on its own.
    }
  }

  /// Called by AuthInterceptor when the refresh token was rejected.
  void sessionExpired() {
    // During build(), build's own 401 handling decides the state.
    if (state.isLoading) return;
    state = const AsyncData(null);
  }

  Future<void> _start(AuthSessionEntity session) async {
    await _tokens.save(
      access: session.accessToken,
      refresh: session.refreshToken,
    );
    state = AsyncData(session.user);
  }
}
