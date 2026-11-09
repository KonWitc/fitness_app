// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'workout_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

WorkoutEntity _$WorkoutEntityFromJson(Map<String, dynamic> json) =>
    WorkoutEntity(
      id: json['id'] as String,
      name: json['name'] as String?,
      date: DateTime.parse(json['date'] as String),
      notes: json['notes'] as String?,
      duration: (json['duration'] as num?)?.toInt(),
      userId: json['userId'] as String,
      exercises: (json['exercises'] as List<dynamic>)
          .map((e) => WorkoutExerciseEntity.fromJson(e as Map<String, dynamic>))
          .toList(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$WorkoutEntityToJson(WorkoutEntity instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'date': instance.date.toIso8601String(),
      'notes': instance.notes,
      'duration': instance.duration,
      'userId': instance.userId,
      'exercises': instance.exercises,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
