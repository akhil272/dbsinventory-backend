import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductLineService } from './product-line.service';
import { CreateProductLineDto } from './dto/create-product-line.dto';
import { UpdateProductLineDto } from './dto/update-product-line.dto';
import { GetProductLineFilterDto } from './dto/get-product-line-filter.dto';
import { ProductLine } from './entities/product-line.entity';
import { ApiResponse } from 'src/utils/types/common';

@Controller('product-line')
export class ProductLineController {
  constructor(private readonly productLineService: ProductLineService) {}

  @Post()
  create(@Body() createProductLineDto: CreateProductLineDto) {
    return this.productLineService.create(createProductLineDto);
  }

  @Get()
  findAll(
    @Query() filterDto: GetProductLineFilterDto,
  ): Promise<ApiResponse<ProductLine[]>> {
    return this.productLineService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productLineService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductLineDto: UpdateProductLineDto,
  ) {
    return this.productLineService.update(+id, updateProductLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productLineService.remove(+id);
  }
}
