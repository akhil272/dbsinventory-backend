import { EntityRepository, Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { User } from 'src/users/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Stock)
export class StocksRepository extends Repository<Stock> {
  async getStocks(filterDto: GetStocksFilterDto): Promise<Stock[]> {
    const { brand, size, search } = filterDto;

    const query = this.createQueryBuilder('stock');

    if (brand) {
      query.andWhere('stock.brand= :brand', { brand });
    }
    if (size) {
      query.andWhere('stock.tyre_size= :size', { size });
    }

    if (search) {
      query.andWhere(
        `LOWER(stock.brand) LIKE LOWER(:search) OR LOWER(stock.tyre_size) LIKE LOWER(:search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    try {
      const stocks = await query
        .leftJoinAndSelect('stock.user', 'user')
        .getMany();
      return stocks;
    } catch (error) {
      throw new InternalServerErrorException('Shit happens');
    }
  }

  async createStock(
    createStockDto: CreateStockDto,
    user: User,
  ): Promise<Stock> {
    const {
      product_line,
      brand,
      tyre_size,
      pattern_name,
      dom,
      purchase_date,
      transport_mode,
      vendor,
      location,
      quantity,
      cost,
    } = createStockDto;
    const stock = this.create({
      product_line,
      brand,
      tyre_size,
      pattern_name,
      dom,
      purchase_date,
      sale_date: null,
      transport_mode,
      vendor,
      location,
      quantity,
      cost,
      user,
      created_by: user.username,
    });
    await this.save(stock);
    return stock;
  }
}
