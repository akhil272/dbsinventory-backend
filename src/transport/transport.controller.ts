import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { TransportService } from './transport.service';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { GetTransportsFilterDto } from './dto/get-transports-filter.dto';
import { ApiResponse } from 'src/utils/types/common';
import { Transport } from './entities/transport.entity';
import { Response } from 'express';

@Controller('transport')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post()
  create(@Body() createTransportDto: CreateTransportDto) {
    return this.transportService.create(createTransportDto);
  }

  @Get()
  findAll(
    @Query() filterDto: GetTransportsFilterDto,
  ): Promise<ApiResponse<Transport[]>> {
    return this.transportService.findAll(filterDto);
  }

  @Get('csv')
  @HttpCode(200)
  async getCSVFile(@Res() res: Response) {
    try {
      const csv = await this.transportService.getCSVData();
      res.header('Content-Type', 'text/csv');
      res.attachment('transports.csv');
      return res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transportService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransportDto: UpdateTransportDto,
  ) {
    return this.transportService.update(+id, updateTransportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transportService.remove(+id);
  }
}
