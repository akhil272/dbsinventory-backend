import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateUserQuoteDto {
  @IsString()
  brandName: string;

  @IsString()
  vehicleBrand: string;

  @IsString()
  vehicleModel: string;

  @IsString()
  @IsOptional()
  patternName: string;

  @IsString()
  tyreSizeValue: string;

  @IsString()
  @IsOptional()
  tyreSpeedRating: string;

  @IsNumber()
  @IsOptional()
  tyreLoadIndex: number;

  @IsString()
  @IsOptional()
  userNotes: string;

  @IsNumber()
  quantity: number;
}
