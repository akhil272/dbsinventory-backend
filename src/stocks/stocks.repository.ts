import { EntityRepository, Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { User } from 'src/users/entities/user.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StocksWithMetaDto } from './dto/stocks-with-meta-dto';
import { Transport } from 'src/transport/entities/transport.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Location } from 'src/location/entities/location.entity';
import { TyreDetail } from 'src/tyre-detail/entities/tyre-detail.entity';
import { StocksExportFileDto } from './dto/stocks-export-file-dto';
import { LoadIndex } from 'src/load-index/entities/load-index.entity';
import { SpeedRating } from 'src/speed-rating/entities/speed-rating.entity';
import { ProductLine } from 'src/product-line/entities/product-line.entity';

@EntityRepository(Stock)
export class StocksRepository extends Repository<Stock> {
  async getStocks(filterDto: GetStocksFilterDto): Promise<StocksWithMetaDto> {
    const {
      brand,
      size,
      pattern,
      search,
      vendor,
      transport,
      location,
      tyreDetailId,
      take = 25,
      page = 1,
    } = filterDto;
    const query = this.createQueryBuilder('stock').where(
      'stock.soldOut= :soldOut',
      { soldOut: false },
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
      .leftJoinAndSelect('stock.transport', 'transport')
      .leftJoinAndSelect('stock.productLine', 'productLine')
      .leftJoinAndSelect('stock.loadIndex', 'loadIndex')
      .leftJoinAndSelect('stock.speedRating', 'speedRating');
    if (brand) {
      query.where('(brand.name ILIKE :brand)', { brand: `%${brand}%` });
    }
    if (size) {
      query.where('(tyreSize.value ILIKE :size)', { size: `%${size}%` });
    }
    if (size && brand) {
      query
        .where('(brand.name ILIKE :brand)', { brand: `%${brand}%` })
        .andWhere('(tyreSize.value ILIKE :size)', { size: `%${size}%` });
    }
    if (tyreDetailId) {
      query.where('stock.tyreDetail = :id', { id: tyreDetailId });
    }
    if (pattern) {
      query.where('(pattern.name ILIKE :pattern)', { pattern: `%${pattern}%` });
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
        '(LOWER(brand.name) LIKE LOWER(:search) or LOWER(tyreSize.value) LIKE LOWER(:search) or LOWER(pattern.name) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    query.orderBy('stock.purchaseDate', 'ASC');
    const [stocks, total] = await query.take(take).skip(skip).getManyAndCount();
    if (total === 0) {
      throw new NotFoundException('No stocks available.');
    }
    const lastPage = Math.ceil(total / take);
    if (lastPage < page) {
      throw new InternalServerErrorException('Requested page does not exists.');
    }
    try {
      return {
        stocks,
        meta: {
          total,
          page,
          lastPage,
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
    speedRating: SpeedRating,
    loadIndex: LoadIndex,
    productLine: ProductLine,
  ) {
    const { dom, purchaseDate, quantity, cost } = createStockDto;
    try {
      const stock = this.create({
        productLine,
        dom,
        purchaseDate,
        tyreDetail,
        transport,
        vendor,
        location,
        purchasedQuantity: quantity,
        quantity,
        cost,
        user,
        speedRating,
        loadIndex,
      });
      await this.save(stock);
      return stock;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add stock to system.');
    }
  }

  async getCSVData(stocksExportFileDto: StocksExportFileDto) {
    const query = this.createQueryBuilder('stock');
    const start = new Date(stocksExportFileDto.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(stocksExportFileDto.endDate);
    end.setHours(24, 0, 0, 0);
    try {
      const stocks = await query
        .where('stock.createdAt >= :start', { start })
        .andWhere('stock.createdAt <= :end', { end })
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
      .leftJoinAndSelect('stock.vendor', 'vendor')
      .leftJoinAndSelect('stock.location', 'location')
      .leftJoinAndSelect('stock.transport', 'transport')
      .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
      .leftJoinAndSelect('stock.productLine', 'productLine')
      .leftJoinAndSelect('stock.speedRating', 'speedRating')
      .leftJoinAndSelect('stock.loadIndex', 'loadIndex')
      .where('(brand.name = :brand)', { brand })
      .andWhere('(tyreSize.value = :tyreSize)', { tyreSize })
      .getMany();
  }

  async findOneByBrandPatternTyreSizeSpeedRatingLoadIndex(
    brand: string,
    pattern: string,
    tyreSize: string,
    speedRating: string,
    loadIndex: number,
  ) {
    if (!speedRating && !loadIndex) {
      const stock = await this.createQueryBuilder('stock')
        .leftJoinAndSelect('stock.tyreDetail', 'tyreDetail')
        .leftJoinAndSelect('tyreDetail.pattern', 'pattern')
        .leftJoinAndSelect('pattern.brand', 'brand')
        .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
        .leftJoinAndSelect('stock.vendor', 'vendor')
        .leftJoinAndSelect('stock.location', 'location')
        .leftJoinAndSelect('stock.transport', 'transport')
        .leftJoinAndSelect('stock.productLine', 'productLine')
        .leftJoinAndSelect('stock.speedRating', 'speedRating')
        .leftJoinAndSelect('stock.loadIndex', 'loadIndex')
        .where('(brand.name = :brand)', { brand })
        .andWhere('(pattern.name = :pattern)', { pattern })
        .andWhere('(tyreSize.value = :tyreSize)', { tyreSize })
        .getOne();
      return stock;
    }
    if (!loadIndex) {
      const stock = await this.createQueryBuilder('stock')
        .leftJoinAndSelect('stock.tyreDetail', 'tyreDetail')
        .leftJoinAndSelect('tyreDetail.pattern', 'pattern')
        .leftJoinAndSelect('pattern.brand', 'brand')
        .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
        .leftJoinAndSelect('stock.vendor', 'vendor')
        .leftJoinAndSelect('stock.location', 'location')
        .leftJoinAndSelect('stock.transport', 'transport')
        .leftJoinAndSelect('stock.productLine', 'productLine')
        .leftJoinAndSelect('stock.speedRating', 'speedRating')
        .leftJoinAndSelect('stock.loadIndex', 'loadIndex')
        .where('(brand.name = :brand)', { brand })
        .andWhere('(pattern.name = :pattern)', { pattern })
        .andWhere('(tyreSize.value = :tyreSize)', { tyreSize })
        .andWhere('(stock.speedRating = :speedRating)', { speedRating })
        .getOne();
      return stock;
    }
    if (!speedRating) {
      const stock = await this.createQueryBuilder('stock')
        .leftJoinAndSelect('stock.tyreDetail', 'tyreDetail')
        .leftJoinAndSelect('tyreDetail.pattern', 'pattern')
        .leftJoinAndSelect('pattern.brand', 'brand')
        .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
        .leftJoinAndSelect('stock.vendor', 'vendor')
        .leftJoinAndSelect('stock.location', 'location')
        .leftJoinAndSelect('stock.transport', 'transport')
        .leftJoinAndSelect('stock.productLine', 'productLine')
        .leftJoinAndSelect('stock.speedRating', 'speedRating')
        .leftJoinAndSelect('stock.loadIndex', 'loadIndex')
        .where('(brand.name = :brand)', { brand })
        .andWhere('(pattern.name = :pattern)', { pattern })
        .andWhere('(tyreSize.value = :tyreSize)', { tyreSize })
        .andWhere('(stock.loadIndex = :loadIndex)', { loadIndex })
        .getOne();
      return stock;
    }

    const stock = await this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.tyreDetail', 'tyreDetail')
      .leftJoinAndSelect('tyreDetail.pattern', 'pattern')
      .leftJoinAndSelect('pattern.brand', 'brand')
      .leftJoinAndSelect('tyreDetail.tyreSize', 'tyreSize')
      .leftJoinAndSelect('stock.vendor', 'vendor')
      .leftJoinAndSelect('stock.location', 'location')
      .leftJoinAndSelect('stock.transport', 'transport')
      .leftJoinAndSelect('stock.productLine', 'productLine')
      .leftJoinAndSelect('stock.speedRating', 'speedRating')
      .leftJoinAndSelect('stock.loadIndex', 'loadIndex')
      .where('(brand.name = :brand)', { brand })
      .andWhere('(pattern.name = :pattern)', { pattern })
      .andWhere('(tyreSize.value = :tyreSize)', { tyreSize })
      .andWhere('(stock.speedRating = :speedRating)', { speedRating })
      .andWhere('(stock.loadIndex = :loadIndex)', { loadIndex })
      .getOne();
    return stock;
  }
}
