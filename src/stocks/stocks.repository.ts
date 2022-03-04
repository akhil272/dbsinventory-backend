import { EntityRepository, Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { User } from 'src/users/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { StocksMetaDto } from './dto/stocks-meta-dto';

@EntityRepository(Stock)
export class StocksRepository extends Repository<Stock> {
  async getStocks(filterDto: GetStocksFilterDto): Promise<StocksMetaDto> {
    const { brand, size, pattern, search, take = 25, page = 1 } = filterDto;

    const query = this.createQueryBuilder('stock').where(
      'stock.sold_out= :sold_out',
      { sold_out: false },
    );

    if (brand) {
      query.andWhere('stock.brand= :brand', { brand });
    }
    if (size) {
      query.andWhere('stock.tyre_size= :size', { size });
    }
    if (pattern) {
      query.andWhere('stock.pattern_name= :pattern', { pattern });
    }

    if (search) {
      query.andWhere(
        `LOWER(stock.brand) LIKE LOWER(:search) OR LOWER(stock.tyre_size) LIKE LOWER(:search)`,
        {
          search: `%${search}%`,
        },
      );
    }
    const skip = (page - 1) * take;
    try {
      const [stocks, total] = await query
        .take(take)
        .skip(skip)
        .getManyAndCount();
      const last_page = Math.ceil(total / take);
      if (last_page < page) {
        throw new InternalServerErrorException();
      }
      return {
        stocks,
        meta: {
          total,
          page,
          last_page,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch stock data from inventory',
      );
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
      transport_mode,
      vendor,
      location,
      quantity,
      cost,
      user,
    });
    await this.save(stock);
    return stock;
  }
}
