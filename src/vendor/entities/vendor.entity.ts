import { Stock } from 'src/stocks/entities/stock.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany((_type) => Stock, (stock) => stock.vendor)
  stocks: Stock[];
}
