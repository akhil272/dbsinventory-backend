import { IsOptional, IsString } from 'class-validator';

export class GetLocationFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}
