import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VehicleModelService } from './vehicle-model.service';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import { UpdateVehicleModelDto } from './dto/update-vehicle-model.dto';

@Controller('vehicle-model')
export class VehicleModelController {
  constructor(private readonly vehicleModelService: VehicleModelService) {}

  @Post()
  create(@Body() createVehicleModelDto: CreateVehicleModelDto) {
    return this.vehicleModelService.create(createVehicleModelDto);
  }

  @Get()
  findAll() {
    return this.vehicleModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleModelService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehicleModelDto: UpdateVehicleModelDto,
  ) {
    return this.vehicleModelService.update(+id, updateVehicleModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleModelService.remove(+id);
  }
}
