import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CurrentUser, Public, TokenService } from '@nestjs/authentication';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthSessionEntity,
  TokenPairEntity,
  UserEntity,
} from './auth.entities.js';
import { AuthService } from './auth.service.js';
import type { AuthUser } from './auth.types.js';
import { RefreshTokenDto, RegisterDto, SignInDto } from './dto/auth.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokenService
  ) {}

  /** Creates the account and signs it in. */
  @Public()
  @Post('register')
  @ApiCreatedResponse({ type: AuthSessionEntity })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  /** Signs in with email + password. */
  @Public()
  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthSessionEntity })
  signIn(@Body() dto: SignInDto) {
    return this.auth.signIn(dto.email, dto.password);
  }

  /**
   * Exchanges a refresh token for a new pair. Unknown, expired or reused
   * tokens get a 401; reuse also signs out every device of that sign-in.
   */
  @Public()
  @Post('token/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenPairEntity })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.tokens.refresh(dto.refreshToken);
  }

  /** Signs this device out. Always 204, so it reveals nothing about the token. */
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async logout(@Body() dto: RefreshTokenDto) {
    await this.tokens.revoke(dto.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
