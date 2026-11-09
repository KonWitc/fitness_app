import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateExerciseDto } from './dto/create-exercise.dto.js';
import { QueryExercisesDto } from './dto/query-exercises.dto.js';
import { UpdateExerciseDto } from './dto/update-exercise.dto.js';
import { ExerciseEntity } from './exercise.entity.js';
import { ExercisesService } from './exercises.service.js';

@ApiTags('exercises')
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercises: ExercisesService) {}

  @Get()
  @ApiOkResponse({ type: [ExerciseEntity] })
  findAll(@Query() query: QueryExercisesDto) {
    return this.exercises.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ExerciseEntity })
  findOne(@Param('id') id: string) {
    return this.exercises.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: ExerciseEntity })
  create(@Body() dto: CreateExerciseDto) {
    return this.exercises.create(dto);
  }

  @Put(':id')
  @ApiOkResponse({ type: ExerciseEntity })
  update(@Param('id') id: string, @Body() dto: UpdateExerciseDto) {
    return this.exercises.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.exercises.remove(id);
  }
}
