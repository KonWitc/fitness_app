// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'update_exercise_dto.g.dart';

@JsonSerializable()
class UpdateExerciseDto {
  const UpdateExerciseDto({
    this.name,
    this.category,
    this.description,
    this.muscleGroup,
    this.imageUrl,
    this.videoUrl,
  });

  factory UpdateExerciseDto.fromJson(Map<String, Object?> json) =>
      _$UpdateExerciseDtoFromJson(json);

  final String? name;
  final String? category;
  final String? description;
  final String? muscleGroup;
  final String? imageUrl;
  final String? videoUrl;

  Map<String, Object?> toJson() => _$UpdateExerciseDtoToJson(this);
}
