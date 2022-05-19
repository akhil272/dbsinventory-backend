import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetTyreSizeFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
