import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductLineDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
