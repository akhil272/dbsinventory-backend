import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetVehicleBrandFilterDto } from './dto/get-vehicle-brand-filter.dto';
import { VehicleBrand } from './entities/vehicle-brand.entity';

@EntityRepository(VehicleBrand)
export class VehicleBrandRepository extends Repository<VehicleBrand> {
  async getVehicleBrands(
    filterDto: GetVehicleBrandFilterDto,
  ): Promise<VehicleBrand[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('vehicle-brand');
    if (search) {
      query.where('(vehicle-brand.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    try {
      const vehicleBrands = await query.getMany();
      return vehicleBrands;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCSVData() {
    const query = this.createQueryBuilder('vehicle-brand');
    try {
      const vehicleBrands = await query.loadAllRelationIds().getMany();
      return vehicleBrands;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
