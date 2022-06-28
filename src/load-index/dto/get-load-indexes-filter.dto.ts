import { IsOptional, IsString } from 'class-validator';

export class GetLoadIndexesFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}
