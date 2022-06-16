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
import { ApiResponse } from 'src/utils/types/common';
import { CustomerCategoryService } from './customer-category.service';
import { CreateCustomerCategoryDto } from './dto/create-customer-category.dto';
import { GetCustomerCategoryFilterDto } from './dto/get-customer-category-filter.dto';
import { UpdateCustomerCategoryDto } from './dto/update-customer-category.dto';
import { CustomerCategory } from './entities/customer-category.entity';

@Controller('customer-category')
export class CustomerCategoryController {
  constructor(
    private readonly customerCategoryService: CustomerCategoryService,
  ) {}

  @Post()
  create(@Body() createCustomerCategoryDto: CreateCustomerCategoryDto) {
    return this.customerCategoryService.create(createCustomerCategoryDto);
  }

  @Get()
  findAll(
    @Query() filterDto: GetCustomerCategoryFilterDto,
  ): Promise<ApiResponse<CustomerCategory[]>> {
    return this.customerCategoryService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerCategoryDto: UpdateCustomerCategoryDto,
  ) {
    return this.customerCategoryService.update(+id, updateCustomerCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerCategoryService.remove(+id);
  }
}
