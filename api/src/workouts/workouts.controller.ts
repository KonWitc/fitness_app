import { Controller, Get, Param, Query } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryWorkoutsDto } from './dto/query-workouts.dto.js';
import { WorkoutEntity } from './workout.entity.js';
import { WorkoutsService } from './workouts.service.js';

/** The signed-in user's workouts only. */
@ApiTags('workouts')
@ApiBearerAuth()
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workouts: WorkoutsService) {}

  @Get()
  @ApiOkResponse({ type: [WorkoutEntity] })
  findAll(@CurrentUser('id') userId: string, @Query() query: QueryWorkoutsDto) {
    return this.workouts.findAll(userId, query);
  }

  @Get(':id')
  @ApiOkResponse({ type: WorkoutEntity })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.workouts.findOne(userId, id);
  }
}
