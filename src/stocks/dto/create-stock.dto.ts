import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  product_line: string;

  @IsNotEmpty()
  @IsNumber()
  tyre_detail_id: number;

  @IsNotEmpty()
  dom: string;

  @IsNotEmpty()
  purchase_date: Date;

  @IsNotEmpty()
  @IsNumber()
  transport_id: number;

  @IsNotEmpty()
  @IsNumber()
  vendor_id: number;

  @IsNotEmpty()
  @IsNumber()
  location_id: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  cost: number;

  @IsNumber()
  @IsOptional()
  speed_rating_id: number;

  @IsNumber()
  @IsOptional()
  load_index_id: number;
}
