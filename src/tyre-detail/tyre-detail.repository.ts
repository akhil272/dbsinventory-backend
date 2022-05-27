import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetTyreDetailsFilterDto } from './dto/get-tyre-detail-filter.dto';
import { TyreDetail } from './entities/tyre-detail.entity';

@EntityRepository(TyreDetail)
export class TyreDetailRepository extends Repository<TyreDetail> {
  async getTyreDetails(
    filterDto: GetTyreDetailsFilterDto,
  ): Promise<TyreDetail[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('tyre-detail').leftJoinAndSelect(
      'tyre-detail.tyreSize',
      'tyreSize',
    );
    if (search) {
      query.where('(tyreSize.size ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    try {
      const tyreDetails = await query
        .leftJoinAndSelect('tyre-detail.pattern', 'pattern')
        .leftJoinAndSelect('pattern.brand', 'brand')
        .getMany();
      return tyreDetails;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
