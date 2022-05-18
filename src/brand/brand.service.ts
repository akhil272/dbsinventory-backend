import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandRepository)
    private readonly brandRepo: BrandRepository,
  ) {}
  async create(createBrandDto: CreateBrandDto) {
    const { name } = createBrandDto;
    try {
      const brand = this.brandRepo.create({
        name,
      });
      await this.brandRepo.save(brand);
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

  findAll() {
    return this.brandRepo.find();
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandRepo.findOne(id);
    if (!brand) {
      throw new NotFoundException('Brand not in the system.');
    }
    return brand;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
