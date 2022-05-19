import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetTyreDetailsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
