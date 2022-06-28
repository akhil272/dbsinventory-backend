import { Exclude } from 'class-transformer';
import { Customer } from 'src/customers/entities/customer.entity';
import LocalFile from 'src/local-files/entities/local-file.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneNumberVerified: boolean;

  @Column({
    nullable: true,
  })
  @Exclude()
  currentHashedRefreshToken?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToMany(() => Stock, (stock) => stock.user)
  stocks: Stock[];

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => LocalFile, {
    nullable: true,
  })
  avatar?: LocalFile;

  @Column({ nullable: true })
  avatarId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @OneToOne(() => Customer, (customer) => customer.user)
  @JoinColumn()
  customer: Customer;
}
