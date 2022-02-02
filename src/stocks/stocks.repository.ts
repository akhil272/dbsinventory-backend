import { EntityRepository, Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { StockStatus } from './stock-status-enum';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';

@EntityRepository(Stock)
export class StocksRepository extends Repository<Stock> {
  async getStocks(filterDto: GetStocksFilterDto): Promise<Stock[]> {
    const { brand, size, search } = filterDto;
    const query = this.createQueryBuilder('stock');

    if (brand) {
      query.andWhere('stock.brand= :brand', { brand });
    }
    if (size) {
      query.andWhere('stock.size= :size', { size });
    }

    if (search) {
      query.andWhere(
        `LOWER(stock.brand) LIKE LOWER(:search) OR LOWER(stock.size) LIKE LOWER(:search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    const stocks = await query.getMany();
    return stocks;
  }

  async createStock(createStockDto: CreateStockDto): Promise<Stock> {
    const { brand, size, pattern, vendor, quantity, cost } = createStockDto;
    const stock = this.create({
      brand,
      size,
      pattern,
      vendor,
      quantity,
      cost,
      status: StockStatus.IN_STOCK,
    });
    await this.save(stock);
    return stock;
  }
}
