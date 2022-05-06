import { Stock } from 'src/stocks/stock.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transport {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ unique: true })
  mode: string;

  @OneToMany((_type) => Stock, (stock) => stock.transport)
  stocks: Stock[];
}