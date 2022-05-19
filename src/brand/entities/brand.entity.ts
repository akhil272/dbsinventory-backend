import { Pattern } from 'src/pattern/entities/pattern.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany((_type) => Pattern, (pattern) => pattern.brand)
  patterns: Pattern[];
}
