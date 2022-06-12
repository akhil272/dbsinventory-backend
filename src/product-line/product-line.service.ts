import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/utils/types/common';
import { CreateProductLineDto } from './dto/create-product-line.dto';
import { GetProductLineFilterDto } from './dto/get-product-line-filter.dto';
import { UpdateProductLineDto } from './dto/update-product-line.dto';
import { ProductLine } from './entities/product-line.entity';
import { ProductLineRepository } from './product-line.repository';

@Injectable()
export class ProductLineService {
  constructor(
    @InjectRepository(ProductLineRepository)
    private readonly productLineRepository: ProductLineRepository,
  ) {}
  create(createProductLineDto: CreateProductLineDto) {
    const productLine = this.productLineRepository.create(createProductLineDto);
    return this.productLineRepository.save(productLine);
  }

  async findAll(
    filterDto: GetProductLineFilterDto,
  ): Promise<ApiResponse<ProductLine[]>> {
    const productLines = await this.productLineRepository.getProductLines(
      filterDto,
    );
    return {
      success: true,
      data: productLines,
    };
  }

  findOne(id: number) {
    return this.productLineRepository.findOne(id);
  }

  update(id: number, updateProductLineDto: UpdateProductLineDto) {
    return this.productLineRepository.update(id, updateProductLineDto);
  }

  remove(id: number) {
    return this.productLineRepository.delete(id);
  }
}
