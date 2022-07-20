import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetTransportsFilterDto } from './dto/get-transports-filter.dto';
import { Transport } from './entities/transport.entity';

@EntityRepository(Transport)
export class TransportRepository extends Repository<Transport> {
  async getTransports(filterDto: GetTransportsFilterDto): Promise<Transport[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('transport');
    if (search) {
      query.where('(transport.mode ILIKE :search)', { search: `%${search}%` });
    }
    try {
      const transports = await query.getMany();
      return transports;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCSVData() {
    const query = this.createQueryBuilder('transport');
    try {
      const transports = await query.loadAllRelationIds().getMany();
      return transports;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
