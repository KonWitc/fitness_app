import 'package:flutter/foundation.dart';

/// Base URL of the NestJS API (without the `/api` prefix: generated client
/// paths already start with `/api/...`).
///
/// Override at build/run time:
///   flutter run --dart-define=API_BASE_URL=http://192.168.1.20:3001
String get apiBaseUrl {
  const fromEnv = String.fromEnvironment('API_BASE_URL');
  if (fromEnv.isNotEmpty) return fromEnv;

  // The Android emulator reaches the host machine through 10.0.2.2
  if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
}
