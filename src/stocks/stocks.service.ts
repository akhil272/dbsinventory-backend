import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Stock } from './stock.entity';
import { StocksRepository } from './stocks.repository';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(StocksRepository)
    private stocksRepository: StocksRepository,
  ) {}

  async getStockById(id: string): Promise<Stock> {
    const found = await this.stocksRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(
        `Stock with ID "${id}" was not found in the database`,
      );
    }
    return found;
  }

  getStocks(filterDto: GetStocksFilterDto): Promise<Stock[]> {
    return this.stocksRepository.getStocks(filterDto);
  }

  createStock(createStockDto: CreateStockDto, user: User): Promise<Stock> {
    return this.stocksRepository.createStock(createStockDto, user);
  }

  async deleteStock(id: string): Promise<void> {
    const result = await this.stocksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Stock with ID "${id}" not found`);
    }
  }

  async updateStockById(
    id: string,
    updateStockDto: UpdateStockDto,
    user: User,
  ): Promise<Stock> {
    const { quantity, sale_date } = updateStockDto;
    const stock = await this.getStockById(id);
    stock.quantity = quantity;
    stock.sale_date = sale_date;
    await this.stocksRepository.save(stock);
    return stock;
  }
}
