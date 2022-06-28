import { IsOptional, IsString } from 'class-validator';

export class GetPatternsFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}
