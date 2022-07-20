import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetPatternsFilterDto } from './dto/get-pattern-filter.dto';
import { Pattern } from './entities/pattern.entity';

@EntityRepository(Pattern)
export class PatternRepository extends Repository<Pattern> {
  async getPatterns(filterDto: GetPatternsFilterDto): Promise<Pattern[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('pattern');
    if (search) {
      query.where('(pattern.name ILIKE :search)', { search: `%${search}%` });
    }
    try {
      const patterns = await query
        .leftJoinAndSelect('pattern.brand', 'brand')
        .orderBy('pattern.id', 'ASC')
        .getMany();
      return patterns;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCSVData() {
    const query = this.createQueryBuilder('pattern');
    try {
      const patterns = await query.loadAllRelationIds().getMany();
      return patterns;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
