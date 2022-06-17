import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { Quotation } from 'src/quotations/entities/quotation.entity';
import { QuotationsService } from 'src/quotations/quotations.service';
import { ApiResponse } from 'src/utils/types/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetServicesFilterDto } from './dto/get-services-filter.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { ServicesRepository } from './services.repository';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServicesRepository)
    private readonly servicesRepository: ServicesRepository,
  ) {}
  async create(createServiceDto: CreateServiceDto) {
    try {
      const service = this.servicesRepository.create(createServiceDto);
      await this.servicesRepository.save(service);
      return service;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Service already exists in the system.',
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
    filterDto: GetServicesFilterDto,
  ): Promise<ApiResponse<Service[]>> {
    const services = await this.servicesRepository.getServices(filterDto);
    return {
      success: true,
      data: services,
    };
  }

  findOne(id: number) {
    const service = this.servicesRepository.findOne(id);
    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
    return service;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }

  async addServiceToQuotation(serviceId: number) {
    const service = await this.findOne(serviceId);
    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
    return service;
  }
}
