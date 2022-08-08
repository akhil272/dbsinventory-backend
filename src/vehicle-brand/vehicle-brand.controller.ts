import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  InternalServerErrorException,
  HttpCode,
  Res,
  Query,
} from '@nestjs/common';
import { VehicleBrandService } from './vehicle-brand.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';
import { GetVehicleBrandFilterDto } from './dto/get-vehicle-brand-filter.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { Response } from 'express';

@Controller('vehicle-brand')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN)
export class VehicleBrandController {
  constructor(private readonly vehicleBrandService: VehicleBrandService) {}

  @Post()
  create(@Body() createVehicleBrandDto: CreateVehicleBrandDto) {
    return this.vehicleBrandService.create(createVehicleBrandDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.MANAGER, Role.USER)
  findAll(@Query() filterDto: GetVehicleBrandFilterDto) {
    return this.vehicleBrandService.findAll(filterDto);
  }

  @Get('csv')
  @HttpCode(200)
  async getCSVFile(@Res() res: Response) {
    try {
      const csv = await this.vehicleBrandService.getCSVData();
      res.header('Content-Type', 'text/csv');
      res.attachment('vehicleBrand.csv');
      return res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleBrandService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehicleBrandDto: UpdateVehicleBrandDto,
  ) {
    return this.vehicleBrandService.update(+id, updateVehicleBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleBrandService.remove(+id);
  }
}
