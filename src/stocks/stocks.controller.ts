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
import { UpdateStockDto } from './dto/update-stock.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/users/roles.gaurd';
import { Roles } from 'src/users/roles.decorator';
import { Role } from 'src/users/entities/role.enum';
import { StocksMetaDto } from './dto/stocks-meta-dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';

@Controller('stocks')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Get()
  getStocks(@Query() filterDto: GetStocksFilterDto): Promise<StocksMetaDto> {
    return this.stocksService.getStocks(filterDto);
  }

  @Get('/:id')
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
