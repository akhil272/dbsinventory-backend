import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetLocationFilterDto } from './dto/get-locations-filter.dto';
import { Location } from './entities/location.entity';

@EntityRepository(Location)
export class LocationRepository extends Repository<Location> {
  async getLocations(filterDto: GetLocationFilterDto): Promise<Location[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('location');
    if (search) {
      query.where('(location.name ILIKE :search)', { search: `%${search}%` });
    }
    try {
      const locations = await query.getMany();
      return locations;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
