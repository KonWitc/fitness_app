import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class QueryWorkoutsDto {
  /** Temporary until auth exists: the user will come from the JWT instead. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ format: 'date-time', example: '2026-01-01' })
  @IsOptional()
  @IsISO8601({}, { message: 'dateFrom must be an ISO date' })
  dateFrom?: string;

  @ApiPropertyOptional({ format: 'date-time', example: '2026-12-31' })
  @IsOptional()
  @IsISO8601({}, { message: 'dateTo must be an ISO date' })
  dateTo?: string;
}
