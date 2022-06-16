import { Customer } from 'src/customers/entities/customer.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustomerCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Customer, (customer) => customer.customerCategory)
  customers: Customer[];
}
