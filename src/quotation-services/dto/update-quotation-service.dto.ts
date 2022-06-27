import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateQuotationServiceDto } from './create-quotation-service.dto';

export class UpdateQuotationServiceDto extends PartialType(
  CreateQuotationServiceDto,
) {
  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  serviceNote?: string;
}
