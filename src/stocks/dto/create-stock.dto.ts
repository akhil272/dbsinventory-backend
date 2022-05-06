import { IsNotEmpty } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  product_line: string;

  @IsNotEmpty()
  tyre_detail_id: string;

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
