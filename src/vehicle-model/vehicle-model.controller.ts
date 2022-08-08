import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { VehicleModelService } from './vehicle-model.service';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import { UpdateVehicleModelDto } from './dto/update-vehicle-model.dto';
import { GetVehicleModelFilterDto } from './dto/get-vehicle-model-filter.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { Response } from 'express';
@Controller('vehicle-model')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN)
export class VehicleModelController {
  constructor(private readonly vehicleModelService: VehicleModelService) {}

  @Post()
  create(@Body() createVehicleModelDto: CreateVehicleModelDto) {
    return this.vehicleModelService.create(createVehicleModelDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.MANAGER, Role.USER)
  findAll(@Query() filterDto: GetVehicleModelFilterDto) {
    return this.vehicleModelService.findAll(filterDto);
  }

  @Get('csv')
  @HttpCode(200)
  async getCSVFile(@Res() res: Response) {
    try {
      const csv = await this.vehicleModelService.getCSVData();
      res.header('Content-Type', 'text/csv');
      res.attachment('vehicleModel.csv');
      return res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
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
