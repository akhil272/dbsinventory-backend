import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_line: string;

  @Column()
  brand: string;

  @Column()
  tyre_size: string;

  @Column()
  pattern_name: string;

  @Column()
  dom: string;

  @Column()
  purchase_date: Date;

  @Type(() => Date)
  @Column({ type: Date, nullable: true })
  sale_date: Date;

  @Column()
  transport_mode: string;

  @Column()
  vendor: string;

  @Column()
  location: string;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @ManyToOne((_type) => User, (user) => user.stocks, { eager: false })
  user: User;

  @OneToMany((_type) => Order, (order) => order.stock)
  orders: Order[];
}
