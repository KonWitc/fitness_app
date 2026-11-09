import { ApiProperty } from '@nestjs/swagger';
import type { AuthUser } from './auth.types.js';

export class UserEntity implements AuthUser {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: String, nullable: true })
  name: string | null;
}

export class TokenPairEntity {
  @ApiProperty({ description: 'JWT for `Authorization: Bearer`, short-lived' })
  accessToken: string;

  @ApiProperty({
    description: 'Opaque and single use: exchange at /api/auth/token/refresh',
  })
  refreshToken: string;

  @ApiProperty({
    type: 'integer',
    description: 'Seconds until the access token expires',
  })
  expiresIn: number;
}

export class AuthSessionEntity extends TokenPairEntity {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}
