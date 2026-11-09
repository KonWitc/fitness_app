import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/generated/fitness_api.dart';
import 'config.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: apiBaseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 15),
    ),
  );
  ref.onDispose(dio.close);
  return dio;
});

/// Typed client generated from the API's OpenAPI spec (see swagger_parser.yaml).
final apiProvider = Provider<FitnessApi>(
  (ref) => FitnessApi(ref.watch(dioProvider)),
);

/// `true` when GET /api/health succeeds.
final apiHealthProvider = FutureProvider<bool>((ref) async {
  try {
    await ref.watch(apiProvider).health.health();
    return true;
  } on DioException {
    return false;
  }
});

/// Turns any error into a message for the user. The API always responds with
/// `{ "error": string }` on failure.
String errorMessage(Object error, [String fallback = 'Something went wrong']) {
  if (error is DioException) {
    final data = error.response?.data;
    if (data is Map && data['error'] is String) return data['error'] as String;
    if (error.response == null) {
      return 'Cannot reach the server at $apiBaseUrl';
    }
  }
  return fallback;
}
