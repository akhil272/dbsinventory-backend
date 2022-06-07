import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateUserQuoteDto } from 'src/user-quote/dto/create-user-quote.dto';

export class CreateQuotationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserQuoteDto)
  userQuotes: CreateUserQuoteDto[];
}
