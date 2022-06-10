import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLoadIndexDto {
  @IsNumber()
  @IsNotEmpty()
  load_index: number;
}
