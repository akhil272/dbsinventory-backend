import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { GetServiceDto } from 'src/services/dto/get-service.dto';
import { CreateUserQuoteDto } from 'src/user-quote/dto/create-user-quote.dto';

export class CreateQuotationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserQuoteDto)
  userQuotes: CreateUserQuoteDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GetServiceDto)
  serviceIds: GetServiceDto[];
}
