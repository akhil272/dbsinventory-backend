import { Stock } from 'src/stocks/stock.entity';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Type(() => Date)
  @Column({ type: Date })
  sale_date: Date;

  @Column()
  sold_price: number;

  @Column()
  quantity: number;

  @Column()
  employee_name: string;

  @Column()
  customer_name: string;

  @Column()
  profit: number;

  @ManyToOne((_type) => Stock, (stock) => stock.orders)
  stock: Stock;
}
