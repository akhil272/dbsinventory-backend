import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StockStatus } from './stock-status-enum';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  size: string;

  @Column()
  pattern: string;

  @Column()
  vendor: string;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @Column()
  status: StockStatus;
}
