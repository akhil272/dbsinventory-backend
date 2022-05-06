import { Exclude } from 'class-transformer';
import { Stock } from 'src/stocks/stock.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  roles: Role;

  @OneToMany((_type) => Stock, (stock) => stock.user, { eager: true })
  stocks: Stock[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
