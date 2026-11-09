// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'token_pair_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TokenPairEntity _$TokenPairEntityFromJson(Map<String, dynamic> json) =>
    TokenPairEntity(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      expiresIn: (json['expiresIn'] as num).toInt(),
    );

Map<String, dynamic> _$TokenPairEntityToJson(TokenPairEntity instance) =>
    <String, dynamic>{
      'accessToken': instance.accessToken,
      'refreshToken': instance.refreshToken,
      'expiresIn': instance.expiresIn,
    };
