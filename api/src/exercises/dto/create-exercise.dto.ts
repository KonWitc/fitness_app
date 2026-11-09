import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  Trim,
  TrimLower,
  TrimLowerOrNull,
  TrimOrNull,
} from '../../common/transforms.js';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Bench Press' })
  @Trim()
  @IsString({ message: 'Name is required' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ example: 'strength', description: 'Stored lowercase' })
  @TrimLower()
  @IsString({ message: 'Category is required' })
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @TrimOrNull()
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'chest',
    description: 'Stored lowercase',
  })
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
