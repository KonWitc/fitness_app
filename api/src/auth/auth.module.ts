import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuth } from './jwt.auth.js';
import { PrismaRefreshTokenStore } from './prisma-refresh-token.store.js';

/**
 * Email + password accounts for the mobile app: short-lived JWT access tokens
 * plus rotating refresh tokens (stored in Postgres). AuthenticationModule
 * registers a global guard, so every route needs a signed-in user unless it
 * is marked `@Public()`.
 */
@Module({
  imports: [
    AuthenticationModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        accessToken: {
          key: config.getOrThrow<string>('JWT_SECRET'),
          issuer: 'fitness-api',
          audience: 'fitness-app',
          ttl: '15m',
        },
        refreshToken: { ttl: '30d', absoluteTtl: '90d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuth, PrismaRefreshTokenStore],
})
export class AuthModule {}
