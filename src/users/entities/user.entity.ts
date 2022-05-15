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

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({
    nullable: true,
  })
  @Exclude()
  public current_hashed_refresh_token?: string;

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
