import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { TableStatus } from '@prisma/client';

export class UpdateTableDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  number?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  capacity?: number;

  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;
}
