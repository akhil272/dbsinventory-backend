import { EntityRepository, Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { User } from 'src/users/entities/user.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StocksMetaDto } from './dto/stocks-meta-dto';
import { Transport } from 'src/transport/entities/transport.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Location } from 'src/location/entities/location.entity';
import { TyreDetail } from 'src/tyre-detail/entities/tyre-detail.entity';
import { StocksExportFileDto } from './dto/stocks-export-file-dto';

@EntityRepository(Stock)
export class StocksRepository extends Repository<Stock> {
  async getStocks(filterDto: GetStocksFilterDto): Promise<StocksMetaDto> {
    const {
      brand,
      size,
      pattern,
      search,
      vendor,
      transport,
      location,
      tyreDetail_id,
      take = 25,
      page = 1,
    } = filterDto;
    const query = this.createQueryBuilder('stock').where(
      'stock.sold_out= :sold_out',
      { sold_out: false },
    );

    const skip = (page - 1) * take;
    const count = await query.getCount();
    if (count <= 0) {
      throw new NotFoundException('No stocks available.');
    }
    query
      .leftJoinAndSelect('stock.tyreDetail', 'tyreDetail')
      .leftJoinAndSelect('tyreDetail.pattern', 'pattern')
      .leftJoinAndSelect('pattern.brand', 'brand')
      .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
      .leftJoinAndSelect('stock.vendor', 'vendor')
      .leftJoinAndSelect('stock.location', 'location')
      .leftJoinAndSelect('stock.transport', 'transport');
    if (tyreDetail_id) {
      query.where('stock.tyreDetail = :id', { id: tyreDetail_id });
    }
    if (size) {
      query.where('(tyreSize.size ILIKE :size)', { size: `%${size}%` });
    }
    if (pattern) {
      query.where('(pattern.name ILIKE :pattern)', { pattern: `%${pattern}%` });
    }
    if (brand) {
      query.where('(brand.name ILIKE :brand)', { brand: `%${brand}%` });
    }
    if (location) {
      query.where('(location.name ILIKE :location)', {
        location: `%${location}%`,
      });
    }
    if (vendor) {
      query.where('(vendor.name ILIKE :vendor)', {
        vendor: `%${vendor}%`,
      });
    }
    if (transport) {
      query.where('(transport.mode ILIKE :transport)', {
        transport: `%${transport}%`,
      });
    }
    if (search) {
      query.where(
        '(LOWER(brand.name) LIKE LOWER(:search) or LOWER(tyreSize.size) LIKE LOWER(:search) or LOWER(pattern.name) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    const [stocks, total] = await query.take(take).skip(skip).getManyAndCount();
    const last_page = Math.ceil(total / take);
    if (last_page < page) {
      throw new InternalServerErrorException('Requested page does not exists.');
    }
    try {
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
    transport: Transport,
    vendor: Vendor,
    location: Location,
    tyreDetail: TyreDetail,
  ) {
    const {
      product_line,
      dom,
      purchase_date,
      quantity,
      cost,
      speed_rating,
      load_index,
    } = createStockDto;
    try {
      const stock = this.create({
        product_line,
        dom,
        purchase_date,
        tyreDetail,
        transport,
        vendor,
        location,
        quantity,
        cost,
        user,
        speed_rating,
        load_index,
      });
      await this.save(stock);
      return stock;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add stock to system.');
    }
  }

  async getExportData(stocksExportFileDto: StocksExportFileDto) {
    const query = this.createQueryBuilder('stock');
    const start = new Date(stocksExportFileDto.start_date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(stocksExportFileDto.end_date);
    end.setHours(24, 0, 0, 0);
    try {
      const stocks = await query
        .where('stock.created_at >= :start', { start })
        .andWhere('stock.created_at <= :end', { end })
        .loadAllRelationIds()
        .getMany();
      return stocks;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch stock data.');
    }
  }

  async findManyByBrandAndTyreSize(brand: string, tyreSize: string) {
    return await this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.tyreDetail', 'tyreDetail')
      .leftJoinAndSelect('tyreDetail.pattern', 'pattern')
      .leftJoinAndSelect('pattern.brand', 'brand')
      .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
      .where('(brand.name = :brand)', { brand })
      .andWhere('(tyreSize.size = :tyreSize)', { tyreSize })
      .getMany();
  }

  async findOneByBrandPatternTyreSizeSpeedRatingLoadIndex(
    brand: string,
    pattern: string,
    tyre_size: string,
    speed_rating: string,
    load_index: number,
  ) {
    if (!speed_rating && !load_index) {
      const stock = await this.createQueryBuilder('stock')
        .leftJoinAndSelect('stock.tyreDetail', 'tyreDetail')
        .leftJoinAndSelect('tyreDetail.pattern', 'pattern')
        .leftJoinAndSelect('pattern.brand', 'brand')
        .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
        .where('(brand.name = :brand)', { brand })
        .andWhere('(pattern.name = :pattern)', { pattern })
        .andWhere('(tyreSize.size = :tyre_size)', { tyre_size })
        .getOne();
      return stock;
    }
    if (!load_index) {
      const stock = await this.createQueryBuilder('stock')
        .leftJoinAndSelect('stock.tyreDetail', 'tyreDetail')
        .leftJoinAndSelect('tyreDetail.pattern', 'pattern')
        .leftJoinAndSelect('pattern.brand', 'brand')
        .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
        .where('(brand.name = :brand)', { brand })
        .andWhere('(pattern.name = :pattern)', { pattern })
        .andWhere('(tyreSize.size = :tyre_size)', { tyre_size })
        .andWhere('(stock.speed_rating = :speed_rating)', { speed_rating })
        .getOne();
      return stock;
    }
    if (!speed_rating) {
      const stock = await this.createQueryBuilder('stock')
        .leftJoinAndSelect('stock.tyreDetail', 'tyreDetail')
        .leftJoinAndSelect('tyreDetail.pattern', 'pattern')
        .leftJoinAndSelect('pattern.brand', 'brand')
        .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
        .where('(brand.name = :brand)', { brand })
        .andWhere('(pattern.name = :pattern)', { pattern })
        .andWhere('(tyreSize.size = :tyre_size)', { tyre_size })
        .andWhere('(stock.load_index = :load_index)', { load_index })
        .getOne();
      return stock;
    }

    const stock = await this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.tyreDetail', 'tyreDetail')
      .leftJoinAndSelect('tyreDetail.pattern', 'pattern')
      .leftJoinAndSelect('pattern.brand', 'brand')
      .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
      .where('(brand.name = :brand)', { brand })
      .andWhere('(pattern.name = :pattern)', { pattern })
      .andWhere('(tyreSize.size = :tyre_size)', { tyre_size })
      .andWhere('(stock.speed_rating = :speed_rating)', { speed_rating })
      .andWhere('(stock.load_index = :load_index)', { load_index })
      .getOne();
    return stock;
  }
}
