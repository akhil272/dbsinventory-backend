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
import { TyreSizeService } from './tyre-size.service';
import { CreateTyreSizeDto } from './dto/create-tyre-size.dto';
import { UpdateTyreSizeDto } from './dto/update-tyre-size.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { GetTyreSizeFilterDto } from './dto/get-tyre-size-filter.dto';
import { TyreSize } from './entities/tyre-size.entity';
import { ApiResponse } from 'src/utils/types/common';
import { Response } from 'express';

@Controller('tyre-size')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class TyreSizeController {
  constructor(private readonly tyreSizeService: TyreSizeService) {}

  @Post()
  create(@Body() createTyreSizeDto: CreateTyreSizeDto) {
    return this.tyreSizeService.create(createTyreSizeDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.MANAGER, Role.USER)
  findAll(
    @Query() filterDto: GetTyreSizeFilterDto,
  ): Promise<ApiResponse<TyreSize[]>> {
    return this.tyreSizeService.findAll(filterDto);
  }

  @Get('csv')
  @HttpCode(200)
  async getCSVFile(@Res() res: Response) {
    try {
      const csv = await this.tyreSizeService.getCSVData();
      res.header('Content-Type', 'text/csv');
      res.attachment('tyreSizes.csv');
      return res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tyreSizeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTyreSizeDto: UpdateTyreSizeDto,
  ) {
    return this.tyreSizeService.update(+id, updateTyreSizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tyreSizeService.remove(+id);
  }
}
