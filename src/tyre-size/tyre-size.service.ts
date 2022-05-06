import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTyreSizeDto } from './dto/create-tyre-size.dto';
import { UpdateTyreSizeDto } from './dto/update-tyre-size.dto';
import { TyreSizeRepository } from './tyre-size.respository';

@Injectable()
export class TyreSizeService {
  constructor(
    @InjectRepository(TyreSizeRepository)
    private readonly tyreSizeRepository: TyreSizeRepository,
  ) {}

  async create(createTyreSizeDto: CreateTyreSizeDto) {
    const { size } = createTyreSizeDto;
    const tyreSize = this.tyreSizeRepository.create({
      size,
    });
    await this.tyreSizeRepository.save(tyreSize);
    return tyreSize;
  }

  findAll() {
    return `This action returns all tyreSize`;
  }

  findOne(id: string) {
    return this.tyreSizeRepository.findOne(id);
  }

  update(id: number, updateTyreSizeDto: UpdateTyreSizeDto) {
    return `This action updates a #${id} tyreSize`;
  }

  remove(id: number) {
    return `This action removes a #${id} tyreSize`;
  }
}
