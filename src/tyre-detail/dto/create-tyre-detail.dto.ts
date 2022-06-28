import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTyreDetailDto {
  @IsNotEmpty()
  @IsNumber()
  tyreSizeId: number;

  @IsNotEmpty()
  @IsNumber()
  patternId: number;
}
