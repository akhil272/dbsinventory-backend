import { Type } from 'class-transformer';
import { Customer } from 'src/customers/entities/customer.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Type(() => Date)
  @Column({ type: Date })
  saleDate: Date;

  @Column()
  salePrice: number;

  @Column()
  quantity: number;

  @Column()
  employeeName: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Column()
  profit: number;

  @ManyToOne((_type) => Stock, (stock) => stock.orders)
  stock: Stock;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
