// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'user_entity.dart';

part 'auth_session_entity.g.dart';

@JsonSerializable()
class AuthSessionEntity {
  const AuthSessionEntity({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresIn,
    required this.user,
  });

  factory AuthSessionEntity.fromJson(Map<String, Object?> json) =>
      _$AuthSessionEntityFromJson(json);

  /// JWT for `Authorization: Bearer`, short-lived
  final String accessToken;

  /// Opaque and single use: exchange at /api/auth/token/refresh
  final String refreshToken;

  /// Seconds until the access token expires
  final int expiresIn;
  final UserEntity user;

  Map<String, Object?> toJson() => _$AuthSessionEntityToJson(this);
}
