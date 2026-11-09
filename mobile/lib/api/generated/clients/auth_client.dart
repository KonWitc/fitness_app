// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/auth_session_entity.dart';
import '../models/refresh_token_dto.dart';
import '../models/register_dto.dart';
import '../models/sign_in_dto.dart';
import '../models/token_pair_entity.dart';
import '../models/user_entity.dart';

part 'auth_client.g.dart';

@RestApi()
abstract class AuthClient {
  factory AuthClient(Dio dio, {String? baseUrl}) = _AuthClient;

  @POST('/api/auth/register')
  Future<AuthSessionEntity> register({@Body() required RegisterDto body});

  @POST('/api/auth/token')
  Future<AuthSessionEntity> signIn({@Body() required SignInDto body});

  @POST('/api/auth/token/refresh')
  Future<TokenPairEntity> refresh({@Body() required RefreshTokenDto body});

  @POST('/api/auth/logout')
  Future<void> logout({@Body() required RefreshTokenDto body});

  @GET('/api/auth/me')
  Future<UserEntity> me();
}
