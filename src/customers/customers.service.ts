import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerCategoryService } from 'src/customer-category/customer-category.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersRepository)
    private readonly customersRepository: CustomersRepository,
    private readonly customerCategoryService: CustomerCategoryService,
    private readonly usersService: UsersService,
  ) {}
  create(createCustomerDto: CreateCustomerDto) {
    return this.customersRepository.create(createCustomerDto);
  }

  findAll() {
    return this.customersRepository.find({
      relations: ['customerCategory', 'user'],
    });
  }

  findOne(id: number) {
    return this.customersRepository.findOne(id, {
      relations: ['customerCategory', 'user', 'orders'],
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customerCategory = await this.customerCategoryService.findOne(
      updateCustomerDto.customerCategoryId,
    );
    return await this.customersRepository.update(id, {
      customerCategory: customerCategory,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  async findElseCreateCustomer(user: User) {
    const customer = await this.customersRepository.findCustomerFromUser(user);
    if (!customer) {
      const newCustomer = new Customer();
      newCustomer.user = user;
      const customerCategory = await this.customerCategoryService.findOne(1);
      newCustomer.customerCategory = customerCategory;
      return await this.customersRepository.save(newCustomer);
    }
    if (customer) {
      if (customer.customerCategory.id === 1) {
        const customerCategory = await this.customerCategoryService.findOne(2);
        customer.customerCategory = customerCategory;
        return await this.customersRepository.save(customer);
      }
    }
    return customer;
  }

  async findCustomerByPhoneNumber(phoneNumber: string) {
    return await this.customersRepository.findCustomerByPhoneNumber(
      phoneNumber,
    );
  }

  async createNewCustomer(
    firstName: string,
    lastName: string,
    phoneNumber: string,
  ) {
    const user = await this.usersService.createNewUser(
      firstName,
      lastName,
      phoneNumber,
    );
    const newCustomer = new Customer();
    newCustomer.user = user;
    const customerCategory = await this.customerCategoryService.findOne(1);
    newCustomer.customerCategory = customerCategory;
    return await this.customersRepository.save(newCustomer);
  }
}
