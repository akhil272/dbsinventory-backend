import { Pattern } from 'src/pattern/entities/pattern.entity';
import { Stock } from 'src/stocks/stock.entity';
import { TyreSize } from 'src/tyre-size/entities/tyre-size.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TyreDetail {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  tyreSizeId: string;

  @Column()
  patternId: string;

  @OneToMany(() => Stock, (stock) => stock.tyreDetail)
  stocks: Stock[];

  @ManyToOne(() => Pattern, (pattern) => pattern.tyreDetails)
  pattern: Pattern;

  @ManyToOne(() => TyreSize, (tyreSize) => tyreSize.tyreDetails)
  tyreSize: TyreSize;
}