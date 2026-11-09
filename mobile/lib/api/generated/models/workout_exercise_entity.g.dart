// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'workout_exercise_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

WorkoutExerciseEntity _$WorkoutExerciseEntityFromJson(
  Map<String, dynamic> json,
) => WorkoutExerciseEntity(
  id: json['id'] as String,
  workoutId: json['workoutId'] as String,
  exerciseId: json['exerciseId'] as String,
  exercise: ExerciseEntity.fromJson(json['exercise'] as Map<String, dynamic>),
  sets: (json['sets'] as num?)?.toInt(),
  reps: (json['reps'] as num?)?.toInt(),
  weight: json['weight'] as num?,
  duration: (json['duration'] as num?)?.toInt(),
  notes: json['notes'] as String?,
  order: (json['order'] as num).toInt(),
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$WorkoutExerciseEntityToJson(
  WorkoutExerciseEntity instance,
) => <String, dynamic>{
  'id': instance.id,
  'workoutId': instance.workoutId,
  'exerciseId': instance.exerciseId,
  'exercise': instance.exercise,
  'sets': instance.sets,
  'reps': instance.reps,
  'weight': instance.weight,
  'duration': instance.duration,
  'notes': instance.notes,
  'order': instance.order,
  'createdAt': instance.createdAt.toIso8601String(),
};
