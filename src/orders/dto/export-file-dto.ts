import { IsString } from 'class-validator';

export class ExportFileDto {
  @IsString()
  start_date: Date;

  @IsString()
  end_date: Date;
}
