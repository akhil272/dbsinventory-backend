import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const brand = this.brandRepo.create({
      name,
    });
    await this.brandRepo.save(brand);
    return brand;
  }

  findAll() {
    return this.brandRepo.find();
  }

  findOne(id: string): Promise<Brand> {
    return this.brandRepo.findOne(id);
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
