import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  InternalServerErrorException,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { GetCsvFileDto } from 'src/users/dto/get-csv-file.dto';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get('csv')
  @Roles(Role.ADMIN)
  @HttpCode(200)
  async getCSVFile(
    @Query() getCsvFileDto: GetCsvFileDto,
    @Res() res: Response,
  ) {
    try {
      const csv = await this.customersService.getCSVData(getCsvFileDto);
      res.header('Content-Type', 'text/csv');
      res.attachment('customers.csv');
      res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
