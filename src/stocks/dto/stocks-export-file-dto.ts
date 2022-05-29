import { IsString } from 'class-validator';

export class StocksExportFileDto {
  @IsString()
  start_date: Date;

  @IsString()
  end_date: Date;
}
