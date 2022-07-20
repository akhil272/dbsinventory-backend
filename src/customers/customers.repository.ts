import { InternalServerErrorException } from '@nestjs/common';
import { GetCsvFileDto } from 'src/users/dto/get-csv-file.dto';
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

  async findCustomerByPhoneNumber(phoneNumber: string) {
    const customer = await this.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .where('user.phoneNumber = :phoneNumber', { phoneNumber })
      .getOne();
    return customer;
  }

  async getCSVData(getCsvFileDto: GetCsvFileDto) {
    const query = this.createQueryBuilder('customer');
    const start = new Date(getCsvFileDto.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(getCsvFileDto.endDate);
    end.setHours(24, 0, 0, 0);
    try {
      const customers = await query
        .where('customer.createdAt >= :start', { start })
        .andWhere('customer.createdAt <= :end', { end })
        .loadAllRelationIds()
        .getMany();
      return customers;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
