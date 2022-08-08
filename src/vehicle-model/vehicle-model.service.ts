import { Injectable } from '@nestjs/common';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import { UpdateVehicleModelDto } from './dto/update-vehicle-model.dto';

@Injectable()
export class VehicleModelService {
  create(createVehicleModelDto: CreateVehicleModelDto) {
    return 'This action adds a new vehicleModel';
  }

  findAll() {
    return `This action returns all vehicleModel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicleModel`;
  }

  update(id: number, updateVehicleModelDto: UpdateVehicleModelDto) {
    return `This action updates a #${id} vehicleModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicleModel`;
  }
}
