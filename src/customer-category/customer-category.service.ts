import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/utils/types/common';
import { CustomerCategoryRepository } from './customer-category.repository';
import { CreateCustomerCategoryDto } from './dto/create-customer-category.dto';
import { GetCustomerCategoryFilterDto } from './dto/get-customer-category-filter.dto';
import { UpdateCustomerCategoryDto } from './dto/update-customer-category.dto';
import { CustomerCategory } from './entities/customer-category.entity';

@Injectable()
export class CustomerCategoryService {
  constructor(
    @InjectRepository(CustomerCategoryRepository)
    private readonly customerCategoryRepository: CustomerCategoryRepository,
  ) {}
  create(createCustomerCategoryDto: CreateCustomerCategoryDto) {
    const customerCategory = this.customerCategoryRepository.create(
      createCustomerCategoryDto,
    );
    return this.customerCategoryRepository.save(customerCategory);
  }

  async findAll(
    filterDto: GetCustomerCategoryFilterDto,
  ): Promise<ApiResponse<CustomerCategory[]>> {
    const customerCategories =
      await this.customerCategoryRepository.getCustomerCategories(filterDto);
    return {
      success: true,
      data: customerCategories,
    };
  }

  findOne(id: number) {
    return this.customerCategoryRepository.findOne(id);
  }

  update(id: number, updateCustomerCategoryDto: UpdateCustomerCategoryDto) {
    return this.customerCategoryRepository.update(
      id,
      updateCustomerCategoryDto,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} customerCategory`;
  }
}
