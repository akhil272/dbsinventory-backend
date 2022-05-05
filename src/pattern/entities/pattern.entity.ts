import { Brand } from 'src/brand/entities/brand.entity';
import { Stock } from 'src/stocks/stock.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Pattern {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @ManyToOne((_type) => Brand, (brand) => brand.patterns)
  brand: Brand;

  @OneToMany((_type) => Stock, (stock) => stock.pattern)
  stocks: Stock[];
}
