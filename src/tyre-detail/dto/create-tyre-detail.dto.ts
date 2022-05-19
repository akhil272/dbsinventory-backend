import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTyreDetailDto {
  @IsNotEmpty()
  @IsNumber()
  tyre_size_id: number;

  @IsNotEmpty()
  @IsNumber()
  pattern_id: number;
}
