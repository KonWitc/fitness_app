// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_exercise_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateExerciseDto _$UpdateExerciseDtoFromJson(Map<String, dynamic> json) =>
    UpdateExerciseDto(
      name: json['name'] as String?,
      category: json['category'] as String?,
      description: json['description'] as String?,
      muscleGroup: json['muscleGroup'] as String?,
      imageUrl: json['imageUrl'] as String?,
      videoUrl: json['videoUrl'] as String?,
    );

Map<String, dynamic> _$UpdateExerciseDtoToJson(UpdateExerciseDto instance) =>
    <String, dynamic>{
      'name': instance.name,
      'category': instance.category,
      'description': instance.description,
      'muscleGroup': instance.muscleGroup,
      'imageUrl': instance.imageUrl,
      'videoUrl': instance.videoUrl,
    };
