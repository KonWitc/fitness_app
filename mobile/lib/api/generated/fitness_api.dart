// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';

import 'clients/health_client.dart';
import 'clients/exercises_client.dart';
import 'clients/workouts_client.dart';

/// Fitness API `v1.0`.
///
///
class FitnessApi {
  FitnessApi(Dio dio, {String? baseUrl}) : _dio = dio, _baseUrl = baseUrl;

  final Dio _dio;
  final String? _baseUrl;

  static String get version => '1.0';

  HealthClient? _health;
  ExercisesClient? _exercises;
  WorkoutsClient? _workouts;

  HealthClient get health => _health ??= HealthClient(_dio, baseUrl: _baseUrl);

  ExercisesClient get exercises =>
      _exercises ??= ExercisesClient(_dio, baseUrl: _baseUrl);

  WorkoutsClient get workouts =>
      _workouts ??= WorkoutsClient(_dio, baseUrl: _baseUrl);
}
