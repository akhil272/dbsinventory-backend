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
  ForbiddenException,
  HttpCode,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import RequestWithUser from 'src/auth/request-with-user.interface';
import { QuotationsResponseDto } from './dto/quotation-response.dto';
import { GetQuotationsFilterDto } from './dto/get-quotations-filter.dto';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { CreateUserAndQuotationDto } from './dto/create-user-and-quotation.dto';
import { Response } from 'express';
import { GetCsvFileDto } from 'src/users/dto/get-csv-file.dto';

@Controller('quotations')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.EMPLOYEE)
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

  @Get('csv')
  @Roles(Role.ADMIN)
  @HttpCode(200)
  async getCSVFile(
    @Query() getCsvFileDto: GetCsvFileDto,
    @Res() res: Response,
  ) {
    try {
      const csv = await this.quotationsService.getCSVData(getCsvFileDto);
      res.header('Content-Type', 'text/csv');
      res.attachment('quotations.csv');
      res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.EMPLOYEE)
  async findOne(@Param('id') id: string, @Req() request: RequestWithUser) {
    if (request.user.role === Role.USER) {
      const quotation = await this.quotationsService.findOne(+id);
      if (quotation.customer.user.phoneNumber !== request.user.phoneNumber) {
        throw new ForbiddenException('Access denied');
      }
    }
    return this.quotationsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.EMPLOYEE)
  update(
    @Param('id') id: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;
    return this.quotationsService.update(+id, user, updateQuotationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotationsService.remove(+id);
  }

  @Post('create/user')
  createUserAndQuotation(
    @Body() createUserAndQuotation: CreateUserAndQuotationDto,
  ) {
    return this.quotationsService.createUserAndQuotation(
      createUserAndQuotation,
    );
  }
}
