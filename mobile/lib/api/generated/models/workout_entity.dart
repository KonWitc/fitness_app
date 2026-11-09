// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'workout_exercise_entity.dart';

part 'workout_entity.g.dart';

@JsonSerializable()
class WorkoutEntity {
  const WorkoutEntity({
    required this.id,
    required this.name,
    required this.date,
    required this.notes,
    required this.duration,
    required this.userId,
    required this.exercises,
    required this.createdAt,
    required this.updatedAt,
  });

  factory WorkoutEntity.fromJson(Map<String, Object?> json) =>
      _$WorkoutEntityFromJson(json);

  final String id;
  final String? name;
  final DateTime date;
  final String? notes;

  /// minutes
  final int? duration;
  final String userId;
  final List<WorkoutExerciseEntity> exercises;
  final DateTime createdAt;
  final DateTime updatedAt;

  Map<String, Object?> toJson() => _$WorkoutEntityToJson(this);
}
