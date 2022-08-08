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
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import { GetVehicleModelFilterDto } from './dto/get-vehicle-model-filter.dto';
import { UpdateVehicleModelDto } from './dto/update-vehicle-model.dto';
import { VehicleModel } from './entities/vehicle-model.entity';
import { VehicleModelRepository } from './vehicle-model.repository';

@Injectable()
export class VehicleModelService {
  constructor(
    @InjectRepository(VehicleModelRepository)
    private readonly vehicleModelRepository: VehicleModelRepository,
  ) {}

  async create(createVehicleModelDto: CreateVehicleModelDto) {
    try {
      const vehicleModel = this.vehicleModelRepository.create(
        createVehicleModelDto,
      );
      await this.vehicleModelRepository.save(vehicleModel);
      return vehicleModel;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Vehicle Model already exists in the system.',
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
    filterDto: GetVehicleModelFilterDto,
  ): Promise<ApiResponse<VehicleModel[]>> {
    const vehicleModels = await this.vehicleModelRepository.getVehicleModels(
      filterDto,
    );
    return {
      success: true,
      data: vehicleModels,
    };
  }

  async findOne(id: number) {
    const vehicleModel = await this.vehicleModelRepository.findOne(id);
    if (!vehicleModel) {
      throw new NotFoundException(
        'Vehicle Model does not exists in the system',
      );
    }
    return vehicleModel;
  }

  async update(id: number, updateVehicleModelDto: UpdateVehicleModelDto) {
    try {
      const vehicleModel = await this.findOne(id);
      vehicleModel.model = updateVehicleModelDto.model;
      await this.vehicleModelRepository.save(vehicleModel);
      return vehicleModel;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update vehicle Model.');
    }
  }

  async remove(id: number) {
    try {
      return await this.vehicleModelRepository.delete(id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Vehicle model is linked to other records. Contact system admin.',
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
      fields: ['VehicleModelId', 'Model', 'VehicleBrandId'],
    });
    const vehicleModels = await this.vehicleModelRepository.getCSVData();
    const json = [];
    vehicleModels.forEach((vehicleModel) => {
      json.push({
        VehicleModelId: vehicleModel.id,
        Model: vehicleModel.model,
        VehicleBrandId: vehicleModel.vehicleBrand,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
