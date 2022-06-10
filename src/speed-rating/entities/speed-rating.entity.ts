import { Stock } from 'src/stocks/entities/stock.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SpeedRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  speed_rating: string;

  @OneToMany(() => Stock, (stock) => stock.speed_rating)
  stocks: Stock[];
}
