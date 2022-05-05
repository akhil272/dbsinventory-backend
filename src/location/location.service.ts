import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationRepository)
    private readonly locationRepo: LocationRepository,
  ) {}
  async create(createLocationDto: CreateLocationDto) {
    const { name } = createLocationDto;
    const location = this.locationRepo.create({
      name,
    });
    await this.locationRepo.save(location);
    return location;
  }

  findAll() {
    return `This action returns all location`;
  }

  findOne(id: string) {
    return this.locationRepo.findOne(id);
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
