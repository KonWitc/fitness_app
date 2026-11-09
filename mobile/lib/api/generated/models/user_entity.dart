// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'user_entity.g.dart';

@JsonSerializable()
class UserEntity {
  const UserEntity({required this.id, required this.email, required this.name});

  factory UserEntity.fromJson(Map<String, Object?> json) =>
      _$UserEntityFromJson(json);

  final String id;
  final String email;
  final String? name;

  Map<String, Object?> toJson() => _$UserEntityToJson(this);
}
