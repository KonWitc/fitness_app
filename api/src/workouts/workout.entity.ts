import { ApiProperty } from '@nestjs/swagger';
import type { Workout, WorkoutExercise } from '../generated/prisma/client.js';
import { ExerciseEntity } from '../exercises/exercise.entity.js';

export class WorkoutExerciseEntity implements WorkoutExercise {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  workoutId: string;

  @ApiProperty({ format: 'uuid' })
  exerciseId: string;

  @ApiProperty({ type: ExerciseEntity })
  exercise: ExerciseEntity;

  @ApiProperty({ type: 'integer', nullable: true })
  sets: number | null;

  @ApiProperty({ type: 'integer', nullable: true })
  reps: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'kg' })
  weight: number | null;

  @ApiProperty({ type: 'integer', nullable: true, description: 'seconds' })
  duration: number | null;

  @ApiProperty({ type: String, nullable: true })
  notes: string | null;

  @ApiProperty({ type: 'integer' })
  order: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

export class WorkoutEntity implements Workout {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ type: String, nullable: true })
  name: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ type: String, nullable: true })
  notes: string | null;

  @ApiProperty({ type: 'integer', nullable: true, description: 'minutes' })
  duration: number | null;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [WorkoutExerciseEntity] })
  exercises: WorkoutExerciseEntity[];

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
