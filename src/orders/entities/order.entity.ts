import { Stock } from 'src/stocks/stock.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sale_date: Date;

  @Column()
  quantity: number;

  @Column()
  update_by_user: string;

  @ManyToOne((_type) => Stock, (stock) => stock.orders)
  stock: Stock;
}
