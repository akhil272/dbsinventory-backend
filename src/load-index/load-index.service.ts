import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/utils/types/common';
import { CreateLoadIndexDto } from './dto/create-load-index.dto';
import { GetLoadIndexesFilterDto } from './dto/get-load-indexes-filter.dto';
import { UpdateLoadIndexDto } from './dto/update-load-index.dto';
import { LoadIndex } from './entities/load-index.entity';
import { LoadIndexRepository } from './load-index.repository';

@Injectable()
export class LoadIndexService {
  constructor(
    @InjectRepository(LoadIndexRepository)
    private readonly loadIndexRepository: LoadIndexRepository,
  ) {}
  async create(createLoadIndexDto: CreateLoadIndexDto) {
    const load_index = this.loadIndexRepository.create({
      ...createLoadIndexDto,
    });
    await this.loadIndexRepository.save(load_index);
    return load_index;
  }

  async findAll(
    filterDto: GetLoadIndexesFilterDto,
  ): Promise<ApiResponse<LoadIndex[]>> {
    const loadIndexes = await this.loadIndexRepository.getLoadIndexes(
      filterDto,
    );
    return {
      success: true,
      data: loadIndexes,
    };
  }

  findOne(id: number) {
    return this.loadIndexRepository.findOne(id);
  }

  update(id: number, updateLoadIndexDto: UpdateLoadIndexDto) {
    return `This action updates a #${id} loadIndex`;
  }

  remove(id: number) {
    return `This action removes a #${id} loadIndex`;
  }
}
