import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePatternDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand_id: string;
}
