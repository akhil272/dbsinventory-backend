import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@EntityRepository(Customer)
export class CustomersRepository extends Repository<Customer> {
  async findCustomerFromUser(user: User) {
    const customer = await this.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('customer.customerCategory', 'customerCategory')
      .where('user.id = :id', { id: user.id })
      .getOne();
    return customer;
  }
}
