import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
import { BrandService } from 'src/brand/brand.service';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { ApiResponse } from 'src/utils/types/common';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { GetPatternsFilterDto } from './dto/get-pattern-filter.dto';
import { UpdatePatternDto } from './dto/update-pattern.dto';
import { Pattern } from './entities/pattern.entity';
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
      const { name, brandId } = createPatternDto;
      const brand = await this.brandService.findOne(brandId);
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

  async findAll(
    filterDto: GetPatternsFilterDto,
  ): Promise<ApiResponse<Pattern[]>> {
    const patterns = await this.patternRepository.getPatterns(filterDto);
    return {
      success: true,
      data: patterns,
    };
  }

  async findOne(id: number) {
    const pattern = await this.patternRepository.findOne(id);
    if (!pattern) {
      throw new NotFoundException(
        'Pattern id provided not found on the system',
      );
    }
    return pattern;
  }

  async update(id: number, updatePatternDto: UpdatePatternDto) {
    try {
      const pattern = await this.findOne(id);
      pattern.name = updatePatternDto.name;
      if (updatePatternDto.brandId) {
        const brand = await this.brandService.findOne(updatePatternDto.brandId);
        pattern.brand = brand;
      }
      await this.patternRepository.save(pattern);
      return pattern;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update pattern.');
    }
  }

  async remove(id: number) {
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

  async getCSVData() {
    const parser = new Parser({
      fields: ['PatternId', 'Name', 'Brand', 'TyreDetails'],
    });
    const brands = await this.patternRepository.getCSVData();
    const json = [];
    brands.forEach((pattern) => {
      json.push({
        PatternId: pattern.id,
        Name: pattern.name,
        Brand: pattern.brand,
        TyreDetails: pattern.tyreDetails,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
