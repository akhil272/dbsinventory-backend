import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { GetServiceDto } from 'src/services/dto/get-service.dto';
import { CreateUserQuoteDto } from 'src/user-quote/dto/create-user-quote.dto';

export class CreateUserAndQuotationDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RegisterUserDto)
  user: RegisterUserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserQuoteDto)
  userQuotes: CreateUserQuoteDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GetServiceDto)
  serviceIds: GetServiceDto[];

  @IsOptional()
  @IsNumber()
  userId: number;
}
