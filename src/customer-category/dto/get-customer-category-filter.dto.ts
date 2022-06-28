import { IsOptional, IsString } from 'class-validator';

export class GetCustomerCategoryFilterDto {
  @IsString()
  @IsOptional()
  search?: string;
}
