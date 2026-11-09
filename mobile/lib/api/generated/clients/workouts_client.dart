// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/workout_entity.dart';

part 'workouts_client.g.dart';

@RestApi()
abstract class WorkoutsClient {
  factory WorkoutsClient(Dio dio, {String? baseUrl}) = _WorkoutsClient;

  @GET('/api/workouts')
  Future<List<WorkoutEntity>> findAll({
    @Query('userId') String? userId,
    @Query('dateFrom') DateTime? dateFrom,
    @Query('dateTo') DateTime? dateTo,
  });

  @GET('/api/workouts/{id}')
  Future<WorkoutEntity> findOne({@Path('id') required String id});
}
