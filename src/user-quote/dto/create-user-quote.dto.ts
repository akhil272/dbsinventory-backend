import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateUserQuoteDto {
  @IsString()
  brandName: string;

  @IsString()
  @IsOptional()
  patternName: string;

  @IsString()
  tyreSizeValue: string;

  @IsString()
  @IsOptional()
  speedRating: string;

  @IsNumber()
  @IsOptional()
  loadIndex: number;

  @IsString()
  @IsOptional()
  notes: string;

  @IsNumber()
  quantity: number;
}
