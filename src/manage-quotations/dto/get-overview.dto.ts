import { IsOptional, IsString } from 'class-validator';

export class GetOverviewDto {
  @IsOptional()
  @IsString()
  startDate: Date;

  @IsString()
  @IsOptional()
  endDate: Date;
}
