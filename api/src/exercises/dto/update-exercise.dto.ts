import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import {
  Trim,
  TrimLower,
  TrimLowerOrNull,
  TrimOrNull,
} from '../../common/transforms.js';

/**
 * Partial update. Omitted fields are left unchanged; optional fields can be
 * cleared with `null` or `""`, but `name` and `category` can't be emptied.
 */
export class UpdateExerciseDto {
  @ApiPropertyOptional()
  @Trim()
  @ValidateIf((_, value) => value !== undefined)
  @IsString({ message: 'Name cannot be empty' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name?: string;

  @ApiPropertyOptional()
  @TrimLower()
  @ValidateIf((_, value) => value !== undefined)
  @IsString({ message: 'Category cannot be empty' })
  @IsNotEmpty({ message: 'Category cannot be empty' })
  category?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @TrimOrNull()
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @TrimLowerOrNull()
  @IsOptional()
  @IsString()
  muscleGroup?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @TrimOrNull()
  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @TrimOrNull()
  @IsOptional()
  @IsString()
  videoUrl?: string | null;
}
