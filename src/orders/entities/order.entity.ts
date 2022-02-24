import { Stock } from 'src/stocks/stock.entity';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Type(() => Date)
  @Column({ type: Date })
  sale_date: Date;

  @Column()
  sold_price: number;

  @Column()
  quantity: number;

  @Column()
  sold_by_user: string;

  @ManyToOne((_type) => Stock, (stock) => stock.orders)
  stock: Stock;
}
