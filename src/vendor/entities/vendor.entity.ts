import { Stock } from 'src/stocks/stock.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany((_type) => Stock, (stock) => stock.vendor)
  stocks: Stock[];
}
