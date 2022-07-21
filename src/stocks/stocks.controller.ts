import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { Stock } from './entities/stock.entity';
import { UpdateStockDto } from './dto/update-stock.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/users/roles.guard';
import { Roles } from 'src/users/roles.decorator';
import { Role } from 'src/users/entities/role.enum';
import { StocksWithMetaDto } from './dto/stocks-with-meta-dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { StocksExportFileDto } from './dto/stocks-export-file-dto';
import { Response } from 'express';

@Controller('stocks')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
@UseInterceptors(ClassSerializerInterceptor)
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.EMPLOYEE)
  getStocks(
    @Query() filterDto: GetStocksFilterDto,
  ): Promise<StocksWithMetaDto> {
    return this.stocksService.getStocks(filterDto);
  }

  @Get('csv')
  @Roles(Role.ADMIN)
  @HttpCode(200)
  async getCSVFile(
    @Query() getCsvFileDto: StocksExportFileDto,
    @Res() res: Response,
  ) {
    try {
      const csv = await this.stocksService.getCSVData(getCsvFileDto);
      res.header('Content-Type', 'text/csv');
      res.attachment('stocks.csv');
      res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
  }

  @Get('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.EMPLOYEE)
  getStockById(@Param('id') id: string): Promise<Stock> {
    return this.stocksService.getStockById(+id);
  }

  @Post()
  createStock(
    @Body() createStockDto: CreateStockDto,
    @GetUser() user: User,
  ): Promise<Stock> {
    return this.stocksService.createStock(createStockDto, user);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  Delete(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.stocksService.deleteStock(+id);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN)
  updateStockQuantity(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<Stock> {
    return this.stocksService.updateStockById(+id, updateStockDto);
  }
}
