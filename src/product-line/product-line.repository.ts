import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetProductLineFilterDto } from './dto/get-product-line-filter.dto';
import { ProductLine } from './entities/product-line.entity';

@EntityRepository(ProductLine)
export class ProductLineRepository extends Repository<ProductLine> {
  async getProductLines(
    filterDto: GetProductLineFilterDto,
  ): Promise<ProductLine[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('productLine');
    if (search) {
      query.where('(productLine.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    try {
      const productLines = await query.getMany();
      return productLines;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
