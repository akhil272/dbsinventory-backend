import { Stock } from 'src/stocks/stock.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tyre {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ unique: true })
  size: string;

  @OneToMany((_type) => Stock, (stock) => stock.tyre_size)
  stocks: Stock[];
}
