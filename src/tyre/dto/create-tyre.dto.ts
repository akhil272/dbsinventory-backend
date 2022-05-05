import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTyreDto {
  @IsNotEmpty()
  @IsString()
  size: string;
}
