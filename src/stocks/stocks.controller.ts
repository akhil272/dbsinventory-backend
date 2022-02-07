import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { Stock } from './stock.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateStockDto } from './dto/update-stock.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('stocks')
@UseGuards(AuthGuard())
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Get()
  getStocks(@Query() filterDto: GetStocksFilterDto): Promise<Stock[]> {
    return this.stocksService.getStocks(filterDto);
  }

  @Get('/:id')
  getStockById(@Param('id') id: string): Promise<Stock> {
    return this.stocksService.getStockById(id);
  }

  @Post()
  createStock(@Body() createStockDto: CreateStockDto): Promise<Stock> {
    return this.stocksService.createStock(createStockDto);
  }

  @Delete('/:id')
  deleteStock(@Param('id') id: string): Promise<void> {
    return this.stocksService.deleteStock(id);
  }

  @Patch('/:id')
  updateStockQuantity(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
    @GetUser() user: User,
  ): Promise<Stock> {
    return this.stocksService.updateStockById(id, updateStockDto, user);
  }
}
