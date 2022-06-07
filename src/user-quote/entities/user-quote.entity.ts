import { Quotation } from 'src/quotations/entities/quotation.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserQuote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quotation, (quotation) => quotation.userQuotes)
  quotation: Quotation;

  @Column()
  brand: string;

  @Column({ nullable: true })
  pattern: string;

  @Column()
  tyre_size: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  speed_rating: string;

  @Column({ nullable: true })
  load_index: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  admin_comments: string;
}
