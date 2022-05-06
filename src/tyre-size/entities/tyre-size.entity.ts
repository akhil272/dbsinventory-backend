import { TyreDetail } from 'src/tyre-detail/entities/tyre-detail.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TyreSize {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ unique: true })
  size: string;

  @OneToMany(() => TyreDetail, (tyreDetail) => tyreDetail.tyreSize)
  tyreDetails: TyreDetail[];
}
