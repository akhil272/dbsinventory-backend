import { IsNotEmpty } from 'class-validator';

export class CreateTyreSizeDto {
  @IsNotEmpty()
  size: string;
}
