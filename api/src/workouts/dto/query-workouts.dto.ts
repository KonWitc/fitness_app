import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

export class QueryWorkoutsDto {
  @ApiPropertyOptional({ format: 'date-time', example: '2026-01-01' })
  @IsOptional()
  @IsISO8601({}, { message: 'dateFrom must be an ISO date' })
  dateFrom?: string;

  @ApiPropertyOptional({ format: 'date-time', example: '2026-12-31' })
  @IsOptional()
  @IsISO8601({}, { message: 'dateTo must be an ISO date' })
  dateTo?: string;
}
