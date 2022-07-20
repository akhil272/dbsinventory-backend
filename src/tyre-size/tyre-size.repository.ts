import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetTyreSizeFilterDto } from './dto/get-tyre-size-filter.dto';
import { TyreSize } from './entities/tyre-size.entity';

@EntityRepository(TyreSize)
export class TyreSizeRepository extends Repository<TyreSize> {
  async getTyreSizes(filterDto: GetTyreSizeFilterDto): Promise<TyreSize[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('tyre-size');
    if (search) {
      query.where('(tyre-size.size ILIKE :search)', { search: `%${search}%` });
    }
    try {
      const tyreSizes = await query.getMany();
      return tyreSizes;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCSVData() {
    const query = this.createQueryBuilder('tyre-size');
    try {
      const tyreSizes = await query.loadAllRelationIds().getMany();
      return tyreSizes;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
