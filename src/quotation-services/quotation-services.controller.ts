import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuotationServicesService } from './quotation-services.service';
import { CreateQuotationServiceDto } from './dto/create-quotation-service.dto';
import { UpdateQuotationServiceDto } from './dto/update-quotation-service.dto';

@Controller('quotation-services')
export class QuotationServicesController {
  constructor(
    private readonly quotationServicesService: QuotationServicesService,
  ) {}

  @Post()
  create(@Body() createQuotationServiceDto: CreateQuotationServiceDto) {
    return this.quotationServicesService.create(createQuotationServiceDto);
  }

  @Get()
  findAll() {
    return this.quotationServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationServicesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuotationServiceDto: UpdateQuotationServiceDto,
  ) {
    return this.quotationServicesService.update(+id, updateQuotationServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotationServicesService.remove(+id);
  }
}
