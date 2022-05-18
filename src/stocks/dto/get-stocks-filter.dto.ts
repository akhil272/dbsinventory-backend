import { IsOptional } from 'class-validator';

export class GetStocksFilterDto {
  @IsOptional()
  brand?: string;

  @IsOptional()
  size?: string;

  @IsOptional()
  pattern?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  take?: number;

  @IsOptional()
  page?: number;
}
