import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetBrandsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
