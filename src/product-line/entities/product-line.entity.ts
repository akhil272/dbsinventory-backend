import { Stock } from 'src/stocks/entities/stock.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductLine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Stock, (stock) => stock.productLine)
  stocks: Stock[];
}
