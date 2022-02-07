import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_line: string;

  @Column()
  brand: string;

  @Column()
  tyre_size: string;

  @Column()
  pattern_name: string;

  @Column()
  dom: string;

  @Column()
  purchase_date: Date | null;

  @Type(() => Date)
  @Column({ type: Date, nullable: true })
  sale_date: Date;

  @Column()
  transport_mode: string;

  @Column()
  vendor: string;

  @Column()
  location: string;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @Column()
  createdBy: string;

  @ManyToOne((_type) => User, (user) => user.stocks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
