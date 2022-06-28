import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQuotationServiceDto {
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @IsNotEmpty()
  @IsNumber()
  quotationId: number;

  @IsOptional()
  price: number;

  @IsOptional()
  @IsString()
  serviceNote: string;
}
