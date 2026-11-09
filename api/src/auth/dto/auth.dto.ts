import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TrimLower, TrimOrNull } from '../../common/transforms.js';

export const PASSWORD_MIN_LENGTH = 8;

export class RegisterDto {
  @ApiProperty({ example: 'alex@example.com' })
  @TrimLower()
  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

  @ApiProperty({ minLength: PASSWORD_MIN_LENGTH, maxLength: 128 })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  })
  @MaxLength(128, { message: 'Password must be at most 128 characters' })
  password: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Alex' })
  @TrimOrNull()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string | null;
}

export class SignInDto {
  @ApiProperty({ example: 'demo@fitness.local' })
  @TrimLower()
  @IsString({ message: 'Email is required' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // No length rule here: a rule change must not lock out existing accounts.
  @ApiProperty()
  @IsString({ message: 'Password is required' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString({ message: 'refreshToken is required' })
  @IsNotEmpty({ message: 'refreshToken is required' })
  refreshToken: string;
}
