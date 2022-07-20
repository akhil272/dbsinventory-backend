import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetServicesFilterDto } from './dto/get-services-filter.dto';
import { Service } from './entities/service.entity';

@EntityRepository(Service)
export class ServicesRepository extends Repository<Service> {
  async getServices(filterDto: GetServicesFilterDto): Promise<Service[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('service');
    if (search) {
      query.where('(service.name ILIKE :search)', { search: `%${search}%` });
    }
    try {
      const Services = await query.getMany();
      return Services;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCSVData() {
    const query = this.createQueryBuilder('service');
    try {
      const services = await query.loadAllRelationIds().getMany();
      return services;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
