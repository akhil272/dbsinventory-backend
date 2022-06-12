import { IsString } from 'class-validator';

export class StocksExportFileDto {
  @IsString()
  startDate: Date;

  @IsString()
  endDate: Date;
}
