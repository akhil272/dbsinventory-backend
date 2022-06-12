import { IsString } from 'class-validator';

export class ExportFileDto {
  @IsString()
  startDate: Date;

  @IsString()
  endDate: Date;
}
