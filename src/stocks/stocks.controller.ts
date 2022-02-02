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

  @Patch('/:id/quantity')
  updateStockQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: string,
  ): Promise<Stock> {
    return this.stocksService.updateStockById(id, quantity);
  }
}
