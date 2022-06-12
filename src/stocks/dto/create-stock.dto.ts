import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  @IsNumber()
  productLineId: number;

  @IsNotEmpty()
  @IsNumber()
  tyreDetailId: number;

  @IsNotEmpty()
  dom: string;

  @IsNotEmpty()
  purchaseDate: Date;

  @IsNotEmpty()
  @IsNumber()
  transportId: number;

  @IsNotEmpty()
  @IsNumber()
  vendorId: number;

  @IsNotEmpty()
  @IsNumber()
  locationId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cost: number;

  @IsNumber()
  @IsOptional()
  speedRatingId: number;

  @IsNumber()
  @IsOptional()
  loadIndexId: number;
}
