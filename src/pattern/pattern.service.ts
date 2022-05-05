import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandService } from 'src/brand/brand.service';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { UpdatePatternDto } from './dto/update-pattern.dto';
import { PatternRepository } from './pattern.repository';

@Injectable()
export class PatternService {
  constructor(
    @InjectRepository(PatternRepository)
    private readonly patternRepo: PatternRepository,
    private readonly brandService: BrandService,
  ) {}
  async create(createPatternDto: CreatePatternDto) {
    const { name, brand_id } = createPatternDto;
    const brand = await this.brandService.findOne(brand_id);
    const pattern = this.patternRepo.create({
      name,
      brand,
    });
    await this.patternRepo.save(pattern);
    return pattern;
  }

  findAll() {
    return `This action returns all pattern`;
  }

  findOne(id: string) {
    return this.patternRepo.findOne(id);
  }

  update(id: number, updatePatternDto: UpdatePatternDto) {
    return `This action updates a #${id} pattern`;
  }

  remove(id: number) {
    return `This action removes a #${id} pattern`;
  }
}
