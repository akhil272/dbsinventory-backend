import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetSpeedRatingsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
