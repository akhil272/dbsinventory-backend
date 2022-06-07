import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import RequestWithUser from 'src/auth/request-with-user.interface';
import { QuotationsResponseDto } from './dto/quotation-response.dto';
import { GetQuotationsFilterDto } from './dto/get-quotations-filter.dto';

@Controller('quotations')
@UseGuards(JwtAuthenticationGuard)
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  create(
    @Body() createQuotationDto: CreateQuotationDto,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;
    return this.quotationsService.create(createQuotationDto, user);
  }

  @Get()
  getQuotations(
    @Query() filterDto: GetQuotationsFilterDto,
  ): Promise<QuotationsResponseDto> {
    return this.quotationsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
  ) {
    return this.quotationsService.update(+id, updateQuotationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotationsService.remove(+id);
  }
}
