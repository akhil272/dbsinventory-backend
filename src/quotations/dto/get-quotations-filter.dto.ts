import { IsOptional } from 'class-validator';

export class GetQuotationsFilterDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  take?: number;

  @IsOptional()
  page?: number;
}
