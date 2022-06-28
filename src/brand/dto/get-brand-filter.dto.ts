import { IsOptional, IsString } from 'class-validator';

export class GetBrandsFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}
