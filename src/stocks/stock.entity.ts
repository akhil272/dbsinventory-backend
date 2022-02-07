import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from 'class-transformer';
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
  purchase_date: Date | null;

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
}
