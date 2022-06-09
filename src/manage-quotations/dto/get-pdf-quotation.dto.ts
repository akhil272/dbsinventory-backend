import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetPDFQuotationDto {
  @IsNotEmpty()
  @IsNumber()
  quotationId: number;
}
