import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { ApiResponse } from 'src/utils/types/common';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { GetBrandsFilterDto } from './dto/get-brand-filter.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandRepository)
    private readonly brandRepository: BrandRepository,
  ) {}
  async create(createBrandDto: CreateBrandDto) {
    const { name } = createBrandDto;
    try {
      const brand = this.brandRepository.create({
        name,
      });
      await this.brandRepository.save(brand);
      return brand;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Brand already exists in the system',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(filterDto: GetBrandsFilterDto): Promise<ApiResponse<Brand[]>> {
    const brands = await this.brandRepository.getBrands(filterDto);
    return {
      success: true,
      data: brands,
    };
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne(id);
    if (!brand) {
      throw new NotFoundException('Brand not in the system.');
    }
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOne(id);
    if (!brand) {
      throw new NotFoundException('Brand not in the system');
    }
    try {
      brand.name = updateBrandDto.name;
      await this.brandRepository.save(brand);
      return brand;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update brand name.');
    }
  }

  async remove(id: number) {
    try {
      return await this.brandRepository.delete(id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Brand is linked to other records. Contact system admin.',
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
      fields: ['BrandId', 'Name', 'Patterns'],
    });
    const brands = await this.brandRepository.getCSVData();
    const json = [];
    brands.forEach((brand) => {
      json.push({
        BrandId: brand.id,
        Name: brand.name,
        Patterns: brand.patterns,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
