// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'token_pair_entity.g.dart';

@JsonSerializable()
class TokenPairEntity {
  const TokenPairEntity({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresIn,
  });

  factory TokenPairEntity.fromJson(Map<String, Object?> json) =>
      _$TokenPairEntityFromJson(json);

  /// JWT for `Authorization: Bearer`, short-lived
  final String accessToken;

  /// Opaque and single use: exchange at /api/auth/token/refresh
  final String refreshToken;

  /// Seconds until the access token expires
  final int expiresIn;

  Map<String, Object?> toJson() => _$TokenPairEntityToJson(this);
}
