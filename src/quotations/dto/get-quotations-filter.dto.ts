import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '../entities/status.enum';

export class GetQuotationsFilterDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  customerCategory?: string;

  @IsOptional()
  take?: number;

  @IsOptional()
  page?: number;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
