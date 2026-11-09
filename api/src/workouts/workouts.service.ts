import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { QueryWorkoutsDto } from './dto/query-workouts.dto.js';

/** Workouts always come back with their exercises (in order) and exercise details. */
const withExercises = {
  exercises: {
    orderBy: { order: 'asc' },
    include: { exercise: true },
  },
} satisfies Prisma.WorkoutInclude;

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll({ userId, dateFrom, dateTo }: QueryWorkoutsDto) {
    const where: Prisma.WorkoutWhereInput = {
      ...(userId && { userId }),
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
    };

    return this.prisma.workout.findMany({
      where,
      include: withExercises,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: withExercises,
    });
    if (!workout) throw new NotFoundException('Workout not found');
    return workout;
  }
}
