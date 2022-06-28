import { Pattern } from 'src/pattern/entities/pattern.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import { TyreSize } from 'src/tyre-size/entities/tyre-size.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TyreDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tyreSizeId: number;

  @Column()
  patternId: number;

  @OneToMany(() => Stock, (stock) => stock.tyreDetail)
  stocks: Stock[];

  @ManyToOne(() => Pattern, (pattern) => pattern.tyreDetails)
  pattern: Pattern;

  @ManyToOne(() => TyreSize, (tyreSize) => tyreSize.tyreDetails)
  tyreSize: TyreSize;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
