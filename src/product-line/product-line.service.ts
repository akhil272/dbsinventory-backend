import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
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
  async create(createProductLineDto: CreateProductLineDto) {
    try {
      const productLine =
        this.productLineRepository.create(createProductLineDto);
      await this.productLineRepository.save(productLine);
      return productLine;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Product line already exists in the system',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
