import { Exclude } from 'class-transformer';
import LocalFile from 'src/local-files/entities/local-file.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
  current_hashed_refresh_token?: string;

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

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => LocalFile, {
    nullable: true,
  })
  avatar?: LocalFile;

  @Column({ nullable: true })
  avatarId?: number;
}
