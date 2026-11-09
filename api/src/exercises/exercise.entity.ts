import { ApiProperty } from '@nestjs/swagger';
import type { Exercise } from '../generated/prisma/client.js';

/** Response shape (documents the API for Swagger / the generated Dart client). */
export class ExerciseEntity implements Exercise {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: String, nullable: true })
  description: string | null;

  @ApiProperty()
  category: string;

  @ApiProperty({ type: String, nullable: true })
  muscleGroup: string | null;

  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;

  @ApiProperty({ type: String, nullable: true })
  videoUrl: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
