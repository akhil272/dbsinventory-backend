import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTyreSizeDto {
  @IsNotEmpty()
  @IsString()
  tyreSizeValue: string;
}
