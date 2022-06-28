import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class SendQuotationDto {
  @IsBoolean()
  whatsApp: boolean;

  @IsBoolean()
  email: boolean;

  @IsBoolean()
  callback: boolean;

  @IsBoolean()
  sms: boolean;

  @IsNotEmpty()
  @IsNumber()
  quotationId: number;
}
