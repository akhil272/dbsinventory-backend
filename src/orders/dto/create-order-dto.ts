import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  update_by_user: string;

  @IsNotEmpty()
  sale_date: string;

  @IsNotEmpty()
  quantity: number;
}
