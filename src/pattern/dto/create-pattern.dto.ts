import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePatternDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  brand_id: number;
}
