import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatternService } from 'src/pattern/pattern.service';
import { TyreSizeService } from 'src/tyre-size/tyre-size.service';
import { CreateTyreDetailDto } from './dto/create-tyre-detail.dto';
import { UpdateTyreDetailDto } from './dto/update-tyre-detail.dto';
import { TyreDetailRepository } from './tyre-detail.repository';

@Injectable()
export class TyreDetailService {
  constructor(
    @InjectRepository(TyreDetailRepository)
    private readonly tyreDetailRepository: TyreDetailRepository,
    private readonly tyreSizeService: TyreSizeService,
    private readonly patternService: PatternService,
  ) {}

  async create(createTyreDetailDto: CreateTyreDetailDto) {
    const { tyre_size_id, pattern_id } = createTyreDetailDto;
    const tyreSize = await this.tyreSizeService.findOne(tyre_size_id);
    const pattern = await this.patternService.findOne(pattern_id);
    const tyreDetail = this.tyreDetailRepository.create({
      tyreSize,
      pattern,
    });
    await this.tyreDetailRepository.save(tyreDetail);
    return tyreDetail;
  }

  findAll() {
    return `This action returns all tyreDetail`;
  }

  findOne(id: string) {
    return this.tyreDetailRepository.findOne(id);
  }

  update(id: number, updateTyreDetailDto: UpdateTyreDetailDto) {
    return `This action updates a #${id} tyreDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} tyreDetail`;
  }
}
