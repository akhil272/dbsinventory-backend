import { IsNotEmpty } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  size: string;

  @IsNotEmpty()
  pattern: string;

  @IsNotEmpty()
  vendor: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  cost: number;
}
