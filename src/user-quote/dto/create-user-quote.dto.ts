import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateUserQuoteDto {
  @IsString()
  brand: string;

  @IsString()
  @IsOptional()
  pattern: string;

  @IsString()
  tyre_size: string;

  @IsString()
  @IsOptional()
  speed_rating: string;

  @IsNumber()
  @IsOptional()
  load_index: number;

  @IsString()
  @IsOptional()
  notes: string;

  @IsNumber()
  quantity: number;
}
