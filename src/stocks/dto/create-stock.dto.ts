import { IsNotEmpty } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  product_line: string;

  @IsNotEmpty()
  pattern_id: string;

  @IsNotEmpty()
  tyre_size_id: string;

  @IsNotEmpty()
  dom: string;

  @IsNotEmpty()
  purchase_date: Date;

  @IsNotEmpty()
  transport_id: string;

  @IsNotEmpty()
  vendor_id: string;

  @IsNotEmpty()
  location_id: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  cost: number;
}
