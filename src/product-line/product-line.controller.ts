import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { ProductLineService } from './product-line.service';
import { CreateProductLineDto } from './dto/create-product-line.dto';
import { UpdateProductLineDto } from './dto/update-product-line.dto';
import { GetProductLineFilterDto } from './dto/get-product-line-filter.dto';
import { ProductLine } from './entities/product-line.entity';
import { ApiResponse } from 'src/utils/types/common';
import { Response } from 'express';

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

  @Get('csv')
  @HttpCode(200)
  async getCSVFile(@Res() res: Response) {
    try {
      const csv = await this.productLineService.getCSVData();
      res.header('Content-Type', 'text/csv');
      res.attachment('productLines.csv');
      return res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
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
