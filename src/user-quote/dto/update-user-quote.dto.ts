import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateUserQuoteDto } from './create-user-quote.dto';

export class UpdateUserQuoteDto extends PartialType(CreateUserQuoteDto) {
  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  admin_comments: string;
}
