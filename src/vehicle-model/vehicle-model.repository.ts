import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetVehicleModelFilterDto } from './dto/get-vehicle-model-filter.dto';
import { VehicleModel } from './entities/vehicle-model.entity';

@EntityRepository(VehicleModel)
export class VehicleModelRepository extends Repository<VehicleModel> {
  async getVehicleModels(
    filterDto: GetVehicleModelFilterDto,
  ): Promise<VehicleModel[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('vehicle-model');
    if (search) {
      query.where('(vehicle-model.model ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    try {
      const vehicleModels = await query
        .leftJoinAndSelect('vehicle-model.vehicleBrand', 'vehicle-brand')
        .orderBy('vehicle-model.id', 'ASC')
        .getMany();
      return vehicleModels;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCSVData() {
    const query = this.createQueryBuilder('vehicle-model');
    try {
      const vehicleModels = await query.loadAllRelationIds().getMany();
      return vehicleModels;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
