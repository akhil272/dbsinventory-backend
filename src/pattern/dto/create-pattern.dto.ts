import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePatternDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  brandId: number;
}
