import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TrimLowerOrNull } from '../../common/transforms.js';

export class QueryExercisesDto {
  @ApiPropertyOptional({ example: 'strength' })
  @TrimLowerOrNull()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'chest' })
  @TrimLowerOrNull()
  @IsOptional()
  @IsString()
  muscleGroup?: string;
}
