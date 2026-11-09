import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { ExercisesModule } from './exercises/exercises.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { WorkoutsModule } from './workouts/workouts.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ExercisesModule,
    WorkoutsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
