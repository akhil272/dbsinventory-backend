import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
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
  async create(createCustomerCategoryDto: CreateCustomerCategoryDto) {
    try {
      const customerCategory = this.customerCategoryRepository.create(
        createCustomerCategoryDto,
      );
      await this.customerCategoryRepository.save(customerCategory);
      return customerCategory;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Customer category already exists in the system.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    return this.customerCategoryRepository.delete(id);
  }

  async getCSVData() {
    const parser = new Parser({
      fields: ['CustomerCategoryId', 'Name', 'Customers'],
    });
    const customerCategories =
      await this.customerCategoryRepository.getCSVData();
    const json = [];
    customerCategories.forEach((customerCategory) => {
      json.push({
        CustomerCategoryId: customerCategory.id,
        Name: customerCategory.name,
        Customers: customerCategory.customers,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
