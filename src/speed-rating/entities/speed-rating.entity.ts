import { Stock } from 'src/stocks/entities/stock.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SpeedRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  @OneToMany(() => Stock, (stock) => stock.speedRating)
  stocks: Stock[];
}
