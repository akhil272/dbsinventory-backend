import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { ApiResponse } from 'src/utils/types/common';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { GetVehicleBrandFilterDto } from './dto/get-vehicle-brand-filter.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';
import { VehicleBrand } from './entities/vehicle-brand.entity';
import { VehicleBrandRepository } from './vehicle-brand.repository';

@Injectable()
export class VehicleBrandService {
  constructor(
    @InjectRepository(VehicleBrandRepository)
    private readonly vehicleBrandRepository: VehicleBrandRepository,
  ) {}
  async create(createVehicleBrandDto: CreateVehicleBrandDto) {
    try {
      const vehicleBrand = this.vehicleBrandRepository.create(
        createVehicleBrandDto,
      );
      await this.vehicleBrandRepository.save(vehicleBrand);
      return vehicleBrand;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Vehicle brand already exists in the system.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    filterDto: GetVehicleBrandFilterDto,
  ): Promise<ApiResponse<VehicleBrand[]>> {
    const vehicleBrands = await this.vehicleBrandRepository.getVehicleBrands(
      filterDto,
    );
    return {
      success: true,
      data: vehicleBrands,
    };
  }

  async findOne(id: number) {
    const vehicleBrand = await this.vehicleBrandRepository.findOne(id);
    if (!vehicleBrand) {
      throw new NotFoundException(
        'Vehicle brand does not exists in the system',
      );
    }
    return vehicleBrand;
  }

  async update(id: number, updateVehicleBrandDto: UpdateVehicleBrandDto) {
    try {
      const vehicleBrand = await this.findOne(id);
      vehicleBrand.vehicleBrand = updateVehicleBrandDto.vehicleBrand;
      await this.vehicleBrandRepository.save(vehicleBrand);
      return vehicleBrand;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update vehicle brand.');
    }
  }

  async remove(id: number) {
    try {
      return await this.vehicleBrandRepository.delete(id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Vehicle brand is linked to other records. Contact system admin.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCSVData() {
    const parser = new Parser({
      fields: ['VehicleBrandId', 'VehicleBrand', 'Models'],
    });
    const vehicleBrands = await this.vehicleBrandRepository.getCSVData();
    const json = [];
    vehicleBrands.forEach((vehicleBrand) => {
      json.push({
        VehicleBrandId: vehicleBrand.id,
        VehicleBrand: vehicleBrand.vehicleBrand,
        Models: vehicleBrand.models,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
