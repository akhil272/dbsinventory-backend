import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsOptional()
  @IsNumber()
  customerCategoryId: number;
}
