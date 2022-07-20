import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
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
    const loadIndex = this.loadIndexRepository.create({
      ...createLoadIndexDto,
    });
    await this.loadIndexRepository.save(loadIndex);
    return loadIndex;
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
    return this.loadIndexRepository.update(id, updateLoadIndexDto);
  }

  remove(id: number) {
    return this.loadIndexRepository.delete(id);
  }

  async getCSVData() {
    const parser = new Parser({
      fields: ['LoadIndexId', 'Value', 'Stocks'],
    });
    const loadIndexes = await this.loadIndexRepository.getCSVData();
    const json = [];
    loadIndexes.forEach((loadIndex) => {
      json.push({
        LoadIndexId: loadIndex.id,
        Value: loadIndex.value,
        Stocks: loadIndex.stocks,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
