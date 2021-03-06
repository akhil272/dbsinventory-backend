import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { ApiResponse } from 'src/utils/types/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { GetLocationFilterDto } from './dto/get-locations-filter.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationRepository)
    private readonly locationRepository: LocationRepository,
  ) {}
  async create(createLocationDto: CreateLocationDto) {
    const { name } = createLocationDto;
    try {
      const location = this.locationRepository.create({
        name,
      });
      await this.locationRepository.save(location);
      return location;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Location already exists in the system.',
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
    filterDto: GetLocationFilterDto,
  ): Promise<ApiResponse<Location[]>> {
    const locations = await this.locationRepository.getLocations(filterDto);
    return {
      success: true,
      data: locations,
    };
  }

  async findOne(id: number) {
    return await this.locationRepository.findOne(id);
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.findOne(id);
    if (!location) {
      throw new NotFoundException('Location not in the system');
    }
    try {
      location.name = updateLocationDto.name;
      await this.locationRepository.save(location);
      return location;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update location name.');
    }
  }

  async remove(id: number) {
    try {
      return await this.locationRepository.delete(id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Location is linked to other records. Contact system admin.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
