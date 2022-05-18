import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandService } from 'src/brand/brand.service';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { UpdatePatternDto } from './dto/update-pattern.dto';
import { PatternRepository } from './pattern.repository';

@Injectable()
export class PatternService {
  constructor(
    @InjectRepository(PatternRepository)
    private readonly patternRepository: PatternRepository,
    private readonly brandService: BrandService,
  ) {}

  async create(createPatternDto: CreatePatternDto) {
    try {
      const { name, brand_id } = createPatternDto;
      const brand = await this.brandService.findOne(brand_id);
      const pattern = this.patternRepository.create({
        name,
        brand,
      });
      await this.patternRepository.save(pattern);
      return pattern;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to add pattern to system.',
      );
    }
  }

  async findAll() {
    return await this.patternRepository.find();
  }

  async findOne(id: string) {
    const pattern = await this.patternRepository.findOne(id);
    if (!pattern) {
      throw new NotFoundException(
        'Pattern id provided not found on the system',
      );
    }
    return pattern;
  }

  async update(id: string, updatePatternDto: UpdatePatternDto) {
    try {
      const pattern = await this.findOne(id);
      pattern.name = updatePatternDto.name;
      if (updatePatternDto.brand_id) {
        const brand = await this.brandService.findOne(
          updatePatternDto.brand_id,
        );
        pattern.brand = brand;
      }
      await this.patternRepository.save(pattern);
      return pattern;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update pattern.');
    }
  }

  async remove(id: string) {
    try {
      return await this.patternRepository.delete(id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Pattern is linked to other records. Contact system admin.',
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
