// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'exercise_entity.dart';

part 'workout_exercise_entity.g.dart';

@JsonSerializable()
class WorkoutExerciseEntity {
  const WorkoutExerciseEntity({
    required this.id,
    required this.workoutId,
    required this.exerciseId,
    required this.exercise,
    required this.sets,
    required this.reps,
    required this.weight,
    required this.duration,
    required this.notes,
    required this.order,
    required this.createdAt,
  });

  factory WorkoutExerciseEntity.fromJson(Map<String, Object?> json) =>
      _$WorkoutExerciseEntityFromJson(json);

  final String id;
  final String workoutId;
  final String exerciseId;
  final ExerciseEntity exercise;
  final int? sets;
  final int? reps;

  /// kg
  final num? weight;

  /// seconds
  final int? duration;
  final String? notes;
  final int order;
  final DateTime createdAt;

  Map<String, Object?> toJson() => _$WorkoutExerciseEntityToJson(this);
}
