import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryWorkoutsDto } from './dto/query-workouts.dto.js';
import { WorkoutEntity } from './workout.entity.js';
import { WorkoutsService } from './workouts.service.js';

@ApiTags('workouts')
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workouts: WorkoutsService) {}

  @Get()
  @ApiOkResponse({ type: [WorkoutEntity] })
  findAll(@Query() query: QueryWorkoutsDto) {
    return this.workouts.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: WorkoutEntity })
  findOne(@Param('id') id: string) {
    return this.workouts.findOne(id);
  }
}
