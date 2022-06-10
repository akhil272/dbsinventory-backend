import { Stock } from 'src/stocks/entities/stock.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoadIndex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  load_index: number;

  @OneToMany(() => Stock, (stock) => stock.load_index)
  stocks: Stock[];
}
