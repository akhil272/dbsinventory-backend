import { Pattern } from 'src/pattern/entities/pattern.entity';
import { Stock } from 'src/stocks/stock.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany((_type) => Pattern, (pattern) => pattern.brand)
  patterns: Pattern[];

  @OneToMany((_type) => Stock, (stock) => stock.pattern)
  stocks: Stock[];
}