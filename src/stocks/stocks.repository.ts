import { EntityRepository, Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { User } from 'src/users/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { StocksMetaDto } from './dto/stocks-meta-dto';
import { Tyre } from 'src/tyre/entities/tyre.entity';
import { Pattern } from 'src/pattern/entities/pattern.entity';
import { Transport } from 'src/transport/entities/transport.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Location } from 'src/location/entities/location.entity';

@EntityRepository(Stock)
export class StocksRepository extends Repository<Stock> {
  async getStocks(filterDto: GetStocksFilterDto): Promise<StocksMetaDto> {
    const { brand, size, pattern, search, take = 25, page = 1 } = filterDto;

    const query = this.createQueryBuilder('stock').where(
      'stock.sold_out= :sold_out',
      { sold_out: false },
    );

    if (size) {
      query.andWhere('stock.tyre_size= :size', { size });
    }
    // if (pattern) {
    //   query.andWhere('stock.pattern= :pattern', { pattern });
    // }

    if (search) {
      query.andWhere(
        `LOWER(stock.pattern) LIKE LOWER(:search) OR LOWER(stock.tyre) LIKE LOWER(:search)`,
        {
          search: `%${search}%`,
        },
      );
    }
    const skip = (page - 1) * take;
    try {
      const [stocks, total] = await query
        .leftJoinAndSelect('stock.pattern', 'pattern')
        .leftJoinAndSelect('stock.tyre_size', 'tyre_size')
        .leftJoinAndSelect('pattern.brand', 'brand')
        .leftJoinAndSelect('stock.vendor', 'vendor')
        .leftJoinAndSelect('stock.location', 'location')
        .leftJoinAndSelect('stock.transport', 'transport')
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
    pattern: Pattern,
    tyre_size: Tyre,
    transport: Transport,
    vendor: Vendor,
    location: Location,
  ) {
    const { product_line, dom, purchase_date, quantity, cost } = createStockDto;
    const stock = this.create({
      product_line,
      pattern,
      tyre_size,
      dom,
      purchase_date,
      transport,
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
