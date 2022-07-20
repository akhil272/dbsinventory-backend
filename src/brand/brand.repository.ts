import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetBrandsFilterDto } from './dto/get-brand-filter.dto';
import { Brand } from './entities/brand.entity';

@EntityRepository(Brand)
export class BrandRepository extends Repository<Brand> {
  async getBrands(filterDto: GetBrandsFilterDto): Promise<Brand[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('brand');
    if (search) {
      query.where('(brand.name ILIKE :search)', { search: `%${search}%` });
    }
    try {
      const brands = await query
        .leftJoinAndSelect('brand.patterns', 'pattern')
        .getMany();
      return brands;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCSVData() {
    const query = this.createQueryBuilder('brand');
    try {
      const brands = await query.loadAllRelationIds().getMany();
      return brands;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
