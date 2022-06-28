import { Customer } from 'src/customers/entities/customer.entity';
import { QuotationService } from 'src/quotation-services/entities/quotation-service.entity';
import { UserQuote } from 'src/user-quote/entities/user-quote.entity';
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

  @Column({ nullable: true })
  validity: number;

  @ManyToOne(() => Customer, (customer) => customer.quotations)
  customer: Customer;

  @Column()
  count: number;

  @OneToMany(
    () => QuotationService,
    (quotationService) => quotationService.quotation,
  )
  quotationServices: QuotationService[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
