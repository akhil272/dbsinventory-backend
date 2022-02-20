import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { Stock } from './stock.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateStockDto } from './dto/update-stock.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/users/roles.gaurd';
import { Roles } from 'src/users/roles.decorator';
import { Role } from 'src/users/entities/role.enum';

@Controller('stocks')
@UseGuards(AuthGuard(), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  getStocks(@Query() filterDto: GetStocksFilterDto): Promise<Stock[]> {
    return this.stocksService.getStocks(filterDto);
  }

  @Get('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  getStockById(@Param('id') id: string): Promise<Stock> {
    return this.stocksService.getStockById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  createStock(
    @Body() createStockDto: CreateStockDto,
    @GetUser() user: User,
  ): Promise<Stock> {
    return this.stocksService.createStock(createStockDto, user);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  deleteStock(@Param('id') id: string): Promise<void> {
    return this.stocksService.deleteStock(id);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  updateStockQuantity(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
    @GetUser() user: User,
  ): Promise<Stock> {
    return this.stocksService.updateStockById(id, updateStockDto, user);
  }
}
