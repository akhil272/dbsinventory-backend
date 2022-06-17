import { PartialType } from '@nestjs/mapped-types';
import { CreateQuotationServiceDto } from './create-quotation-service.dto';

export class UpdateQuotationServiceDto extends PartialType(CreateQuotationServiceDto) {}
