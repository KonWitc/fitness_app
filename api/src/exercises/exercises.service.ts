import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExerciseDto } from './dto/create-exercise.dto.js';
import { QueryExercisesDto } from './dto/query-exercises.dto.js';
import { UpdateExerciseDto } from './dto/update-exercise.dto.js';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll({ category, muscleGroup }: QueryExercisesDto) {
    return this.prisma.exercise.findMany({
      where: {
        ...(category && { category }),
        ...(muscleGroup && { muscleGroup }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({ where: { id } });
    if (!exercise) throw new NotFoundException('Exercise not found');
    return exercise;
  }

  create(dto: CreateExerciseDto) {
    return this.prisma.exercise.create({ data: dto });
  }

  async update(id: string, dto: UpdateExerciseDto) {
    await this.findOne(id);
    return this.prisma.exercise.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.exercise.delete({ where: { id } });
    } catch (error) {
      // Foreign key violation: the exercise is referenced by logged workouts
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'Exercise is used in workouts and cannot be deleted'
        );
      }
      throw error;
    }
  }
}
