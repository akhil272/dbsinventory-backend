import { IsOptional } from 'class-validator';

export class GetStocksFilterDto {
  @IsOptional()
  brand?: string;

  @IsOptional()
  vendor?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  transport?: string;

  @IsOptional()
  size?: string;

  @IsOptional()
  pattern?: string;

  @IsOptional()
  tyreDetail_id?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  take?: number;

  @IsOptional()
  page?: number;
}
