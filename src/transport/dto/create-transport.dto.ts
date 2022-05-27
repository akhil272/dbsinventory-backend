import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransportDto {
  @IsString()
  @IsNotEmpty()
  mode: string;
}
