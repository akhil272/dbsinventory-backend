import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SendQuotationDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  validity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quotationId: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  notes: string;
}
