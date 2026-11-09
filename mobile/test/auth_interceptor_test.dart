import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:fitness_app/core/auth/auth_interceptor.dart';
import 'package:fitness_app/core/auth/token_store.dart';
import 'package:flutter_test/flutter_test.dart';

/// Answers requests with [handler] instead of the network.
class FakeAdapter implements HttpClientAdapter {
  FakeAdapter(this.handler);

  final Future<ResponseBody> Function(RequestOptions options) handler;
  final requests = <RequestOptions>[];

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) {
    requests.add(options);
    return handler(options);
  }

  @override
  void close({bool force = false}) {}
}

ResponseBody json(int status, Object body) => ResponseBody.fromString(
  jsonEncode(body),
  status,
  headers: {
    Headers.contentTypeHeader: [Headers.jsonContentType],
  },
);

class BrokenStore extends MemorySecureStore {
  @override
  Future<String?> read(String key) => throw Exception('BadPaddingException');
}

void main() {
  test('unreadable secure storage loads as signed out', () async {
    final store = TokenStore(BrokenStore());
    await store.load();
    expect(store.refreshToken, isNull);
  });

  late TokenStore tokens;
  late Dio dio;
  late FakeAdapter api;
  late FakeAdapter refreshApi;
  late int expiredCalls;

  /// API that accepts only `Bearer fresh`; refresh hands out `fresh`.
  void setUpDio({Future<ResponseBody> Function(RequestOptions)? refresh}) {
    api = FakeAdapter((o) async {
      final ok = o.headers['Authorization'] == 'Bearer fresh';
      return ok
          ? json(200, {'ok': true})
          : json(401, {'error': 'token expired'});
    });
    refreshApi = FakeAdapter(
      refresh ??
          (o) async => json(200, {
            'accessToken': 'fresh',
            'refreshToken': 'refresh-2',
            'expiresIn': 900,
          }),
    );
    final refreshDio = Dio(BaseOptions(baseUrl: 'http://api'))
      ..httpClientAdapter = refreshApi;
    dio = Dio(BaseOptions(baseUrl: 'http://api'))..httpClientAdapter = api;
    dio.interceptors.add(
      AuthInterceptor(
        dio: dio,
        refreshDio: refreshDio,
        tokens: tokens,
        onSessionExpired: () => expiredCalls++,
      ),
    );
  }

  setUp(() async {
    tokens = TokenStore(MemorySecureStore());
    await tokens.save(access: 'stale', refresh: 'refresh-1');
    expiredCalls = 0;
  });

  test('refreshes an expired access token and retries once', () async {
    setUpDio();

    final res = await dio.get<dynamic>('/api/workouts');

    expect(res.data, {'ok': true});
    expect(refreshApi.requests.single.data, {'refreshToken': 'refresh-1'});
    expect(tokens.accessToken, 'fresh');
    expect(tokens.refreshToken, 'refresh-2');
    expect(api.requests.map((r) => r.headers['Authorization']), [
      'Bearer stale',
      'Bearer fresh',
    ]);
  });

  test('concurrent 401s share a single refresh', () async {
    setUpDio();

    await Future.wait([
      dio.get<dynamic>('/api/workouts'),
      dio.get<dynamic>('/api/exercises'),
      dio.get<dynamic>('/api/auth/me'),
    ]);

    expect(refreshApi.requests, hasLength(1));
  });

  test('a rejected refresh token ends the session', () async {
    setUpDio(
      refresh: (o) async => json(401, {'error': 'Invalid refresh token'}),
    );

    await expectLater(
      dio.get<dynamic>('/api/workouts'),
      throwsA(
        isA<DioException>().having(
          (e) => e.response?.statusCode,
          'status',
          401,
        ),
      ),
    );
    expect(tokens.accessToken, isNull);
    expect(tokens.refreshToken, isNull);
    expect(expiredCalls, 1);
  });

  test('offline during refresh keeps the session', () async {
    setUpDio(
      refresh: (o) async => throw DioException.connectionError(
        requestOptions: o,
        reason: 'offline',
      ),
    );

    await expectLater(dio.get<dynamic>('/api/workouts'), throwsA(anything));
    expect(tokens.refreshToken, 'refresh-1');
    expect(expiredCalls, 0);
  });

  test('a wrong password on sign-in is not "refreshed"', () async {
    setUpDio();

    await expectLater(
      dio.post<dynamic>(
        '/api/auth/token',
        data: {'email': 'a', 'password': 'b'},
      ),
      throwsA(isA<DioException>()),
    );
    expect(refreshApi.requests, isEmpty);
    expect(api.requests.single.headers.containsKey('Authorization'), isFalse);
  });
}
