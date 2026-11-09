import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  JwtBearerProvider,
  type JwtClaims,
} from '@nestjs/authentication';
import { PrismaService } from '../prisma/prisma.service.js';
import { authUserSelect, type AuthUser } from './auth.types.js';

/**
 * `Authorization: Bearer <access token>` on every request. Verifies the tokens
 * TokenService signs (key, issuer and audience from the module options) and
 * loads the user; a deleted user's token is rejected.
 */
@Injectable()
export class JwtAuth extends JwtBearerProvider<AuthUser> {
  constructor(
    private readonly prisma: PrismaService,
    registry: AuthenticationRegistry
  ) {
    super({ realm: 'fitness-api' });
    registry.registerProvider(this);
  }

  protected validate({ sub }: JwtClaims) {
    if (!sub) return null;
    return this.prisma.user.findUnique({
      where: { id: sub },
      select: authUserSelect,
    });
  }
}
