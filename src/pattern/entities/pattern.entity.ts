import { Brand } from 'src/brand/entities/brand.entity';
import { TyreDetail } from 'src/tyre-detail/entities/tyre-detail.entity';
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

  @OneToMany(() => TyreDetail, (tyreDetail) => tyreDetail.pattern)
  tyreDetails: TyreDetail[];
}
