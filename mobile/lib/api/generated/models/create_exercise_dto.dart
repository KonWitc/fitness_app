// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'create_exercise_dto.g.dart';

@JsonSerializable()
class CreateExerciseDto {
  const CreateExerciseDto({
    required this.name,
    required this.category,
    this.description,
    this.muscleGroup,
    this.imageUrl,
    this.videoUrl,
  });

  factory CreateExerciseDto.fromJson(Map<String, Object?> json) =>
      _$CreateExerciseDtoFromJson(json);

  final String name;

  /// Stored lowercase
  final String category;
  final String? description;

  /// Stored lowercase
  final String? muscleGroup;
  final String? imageUrl;
  final String? videoUrl;

  Map<String, Object?> toJson() => _$CreateExerciseDtoToJson(this);
}
