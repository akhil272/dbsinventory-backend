import { UserQuote } from 'src/user-quote/entities/user-quote.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from './status.enum';

@Entity()
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => UserQuote, (userQuote) => userQuote.quotation)
  userQuotes: UserQuote[];

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.quotations)
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
