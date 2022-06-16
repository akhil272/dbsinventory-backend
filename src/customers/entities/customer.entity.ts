import { CustomerCategory } from 'src/customer-category/entities/customer-category.entity';
import { Quotation } from 'src/quotations/entities/quotation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => CustomerCategory,
    (customerCategory) => customerCategory.customers,
  )
  customerCategory: CustomerCategory;

  @OneToMany(() => Quotation, (quotation) => quotation.customer)
  quotations: Quotation[];

  @OneToOne(() => User, (user) => user.customer)
  user: User;
  quotationsCount: number;
}
