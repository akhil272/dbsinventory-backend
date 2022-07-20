import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetCustomerCategoryFilterDto } from './dto/get-customer-category-filter.dto';
import { CustomerCategory } from './entities/customer-category.entity';

@EntityRepository(CustomerCategory)
export class CustomerCategoryRepository extends Repository<CustomerCategory> {
  async getCustomerCategories(
    filterDto: GetCustomerCategoryFilterDto,
  ): Promise<CustomerCategory[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('customer-category');
    if (search) {
      query.where('(customer-category.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    try {
      const customerCategories = await query.getMany();
      return customerCategories;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCSVData() {
    const query = this.createQueryBuilder('customer-category');
    try {
      const customerCategories = await query.loadAllRelationIds().getMany();
      return customerCategories;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
