import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTyreDto } from './dto/create-tyre.dto';
import { UpdateTyreDto } from './dto/update-tyre.dto';
import { TyreRepository } from './tyre.repository';

@Injectable()
export class TyreService {
  constructor(
    @InjectRepository(TyreRepository)
    private readonly tyreRepo: TyreRepository,
  ) {}
  async create(createTyreDto: CreateTyreDto) {
    const { size } = createTyreDto;
    const tyre = this.tyreRepo.create({
      size,
    });
    await this.tyreRepo.save(tyre);
    return tyre;
  }

  findAll() {
    return `This action returns all tyre`;
  }

  async findOne(id: string) {
    return await this.tyreRepo.findOne(id);
  }

  update(id: number, updateTyreDto: UpdateTyreDto) {
    return `This action updates a #${id} tyre`;
  }

  remove(id: number) {
    return `This action removes a #${id} tyre`;
  }
}
