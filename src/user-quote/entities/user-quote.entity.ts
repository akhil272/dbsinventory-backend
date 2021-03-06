import { Quotation } from 'src/quotations/entities/quotation.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserQuote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quotation, (quotation) => quotation.userQuotes)
  quotation: Quotation;

  @Column()
  brandName: string;

  @Column({ nullable: true })
  patternName: string;

  @Column()
  tyreSizeValue: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  tyreSpeedRating: string;

  @Column({ nullable: true })
  tyreLoadIndex: number;

  @Column({ nullable: true })
  quotePrice: number;

  @Column({ nullable: true })
  userNotes: string;

  @Column({ nullable: true })
  adminComments: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
