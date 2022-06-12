import { Type } from 'class-transformer';
import { Stock } from 'src/stocks/entities/stock.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @Column()
  customerName: string;

  @Column()
  customerPhoneNumber: string;

  @Column()
  profit: number;

  @ManyToOne((_type) => Stock, (stock) => stock.orders)
  stock: Stock;

  @CreateDateColumn()
  createdAt: Date;
}
