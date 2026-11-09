// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'exercise_entity.g.dart';

@JsonSerializable()
class ExerciseEntity {
  const ExerciseEntity({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.muscleGroup,
    required this.imageUrl,
    required this.videoUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ExerciseEntity.fromJson(Map<String, Object?> json) =>
      _$ExerciseEntityFromJson(json);

  final String id;
  final String name;
  final String? description;
  final String category;
  final String? muscleGroup;
  final String? imageUrl;
  final String? videoUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  Map<String, Object?> toJson() => _$ExerciseEntityToJson(this);
}
