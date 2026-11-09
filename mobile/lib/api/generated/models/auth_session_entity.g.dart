// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_session_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthSessionEntity _$AuthSessionEntityFromJson(Map<String, dynamic> json) =>
    AuthSessionEntity(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      expiresIn: (json['expiresIn'] as num).toInt(),
      user: UserEntity.fromJson(json['user'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AuthSessionEntityToJson(AuthSessionEntity instance) =>
    <String, dynamic>{
      'accessToken': instance.accessToken,
      'refreshToken': instance.refreshToken,
      'expiresIn': instance.expiresIn,
      'user': instance.user,
    };
