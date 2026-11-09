// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_exercise_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateExerciseDto _$CreateExerciseDtoFromJson(Map<String, dynamic> json) =>
    CreateExerciseDto(
      name: json['name'] as String,
      category: json['category'] as String,
      description: json['description'] as String?,
      muscleGroup: json['muscleGroup'] as String?,
      imageUrl: json['imageUrl'] as String?,
      videoUrl: json['videoUrl'] as String?,
    );

Map<String, dynamic> _$CreateExerciseDtoToJson(CreateExerciseDto instance) =>
    <String, dynamic>{
      'name': instance.name,
      'category': instance.category,
      'description': instance.description,
      'muscleGroup': instance.muscleGroup,
      'imageUrl': instance.imageUrl,
      'videoUrl': instance.videoUrl,
    };
