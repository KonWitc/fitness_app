// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/create_exercise_dto.dart';
import '../models/exercise_entity.dart';
import '../models/update_exercise_dto.dart';

part 'exercises_client.g.dart';

@RestApi()
abstract class ExercisesClient {
  factory ExercisesClient(Dio dio, {String? baseUrl}) = _ExercisesClient;

  @GET('/api/exercises')
  Future<List<ExerciseEntity>> findAll({
    @Query('category') String? category,
    @Query('muscleGroup') String? muscleGroup,
  });

  @POST('/api/exercises')
  Future<ExerciseEntity> create({@Body() required CreateExerciseDto body});

  @GET('/api/exercises/{id}')
  Future<ExerciseEntity> findOne({@Path('id') required String id});

  @PUT('/api/exercises/{id}')
  Future<ExerciseEntity> update({
    @Path('id') required String id,
    @Body() required UpdateExerciseDto body,
  });

  @DELETE('/api/exercises/{id}')
  Future<void> remove({@Path('id') required String id});
}
