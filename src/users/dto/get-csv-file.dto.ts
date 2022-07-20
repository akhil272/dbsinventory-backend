import { IsString } from 'class-validator';

export class GetCsvFileDto {
  @IsString()
  startDate: Date;

  @IsString()
  endDate: Date;
}
