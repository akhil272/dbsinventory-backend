import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetLoadIndexesFilterDto } from './dto/get-load-indexes-filter.dto';
import { LoadIndex } from './entities/load-index.entity';

@EntityRepository(LoadIndex)
export class LoadIndexRepository extends Repository<LoadIndex> {
  async getLoadIndexes(
    filterDto: GetLoadIndexesFilterDto,
  ): Promise<LoadIndex[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('load-index');
    if (search) {
      query.where('(load_index.load_index ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    try {
      const load_indexes = await query.getMany();
      return load_indexes;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
