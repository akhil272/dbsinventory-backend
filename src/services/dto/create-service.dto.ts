import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  quotationId: number;
}
