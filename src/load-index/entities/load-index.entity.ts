import { Stock } from 'src/stocks/entities/stock.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoadIndex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @OneToMany(() => Stock, (stock) => stock.loadIndex)
  stocks: Stock[];
}
