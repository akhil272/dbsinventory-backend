import { IsOptional, IsString } from 'class-validator';

export class GetProductLineFilterDto {
  @IsString()
  @IsOptional()
  search: string;
}
