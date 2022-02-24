import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  sold_by_user: string;

  @IsNotEmpty()
  sold_price: number;

  @IsNotEmpty()
  quantity: number;
}
