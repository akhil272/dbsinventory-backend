import { IsNotEmpty } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  product_line: string;

  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  tyre_size: string;

  @IsNotEmpty()
  pattern_name: string;

  @IsNotEmpty()
  dom: string;

  @IsNotEmpty()
  purchase_date: Date;

  @IsNotEmpty()
  transport_mode: string;

  @IsNotEmpty()
  vendor: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  cost: number;
}
