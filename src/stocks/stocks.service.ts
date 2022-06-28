import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { LoadIndexService } from 'src/load-index/load-index.service';
import { LocationService } from 'src/location/location.service';
import { ProductLineService } from 'src/product-line/product-line.service';
import { SpeedRatingService } from 'src/speed-rating/speed-rating.service';
import { TransportService } from 'src/transport/transport.service';
import { TyreDetailService } from 'src/tyre-detail/tyre-detail.service';
import { User } from 'src/users/entities/user.entity';
import { VendorService } from 'src/vendor/vendor.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { StocksExportFileDto } from './dto/stocks-export-file-dto';
import { StocksWithMetaDto } from './dto/stocks-with-meta-dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Stock } from './entities/stock.entity';
import { StocksRepository } from './stocks.repository';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(StocksRepository)
    private stocksRepository: StocksRepository,
    private readonly transportService: TransportService,
    private readonly vendorService: VendorService,
    private readonly locationService: LocationService,
    private readonly tyreDetailService: TyreDetailService,
    private readonly loadIndexService: LoadIndexService,
    private readonly speedRatingService: SpeedRatingService,
    private readonly productLineService: ProductLineService,
  ) {}

  async getStockById(id: number): Promise<Stock> {
    const found = await this.stocksRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(
        `Stock with ID "${id}" was not found in the database`,
      );
    }
    return found;
  }

  getStocks(filterDto: GetStocksFilterDto): Promise<StocksWithMetaDto> {
    return this.stocksRepository.getStocks(filterDto);
  }

  async createStock(
    createStockDto: CreateStockDto,
    user: User,
  ): Promise<Stock> {
    const {
      transportId,
      tyreDetailId,
      vendorId,
      locationId,
      speedRatingId,
      loadIndexId,
      productLineId,
    } = createStockDto;
    const transport = await this.transportService.findOne(transportId);
    if (!transport) {
      throw new NotFoundException(
        `Transport with ID "${transportId}" not found`,
      );
    }
    const vendor = await this.vendorService.findOne(vendorId);
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID "${vendorId}" not found`);
    }
    const location = await this.locationService.findOne(locationId);
    if (!location) {
      throw new NotFoundException(`Location with ID "${locationId}" not found`);
    }
    const tyreDetail = await this.tyreDetailService.findOne(tyreDetailId);
    if (!tyreDetail) {
      throw new NotFoundException(`Tyre with ID "${tyreDetailId}" not found`);
    }
    const productLine = await this.productLineService.findOne(productLineId);
    if (!productLine) {
      throw new NotFoundException(`Tyre with ID "${tyreDetailId}" not found`);
    }

    const speedRating = await this.speedRatingService.findOne(speedRatingId);
    const loadIndex = await this.loadIndexService.findOne(loadIndexId);

    return this.stocksRepository.createStock(
      createStockDto,
      user,
      transport,
      vendor,
      location,
      tyreDetail,
      speedRating,
      loadIndex,
      productLine,
    );
  }

  async deleteStock(id: number): Promise<{ success: boolean }> {
    try {
      const result = await this.stocksRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Stock with ID "${id}" not found`);
      }
      return { success: true };
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Stock is linked to other records. Contact system admin.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStockById(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<Stock> {
    const {
      quantity,
      cost,
      dom,
      locationId,
      productLineId,
      purchaseDate,
      transportId,
      tyreDetailId,
      vendorId,
    } = updateStockDto;
    const stock = await this.getStockById(id);
    try {
      stock.quantity = quantity;
      stock.cost = cost;
      stock.dom = dom;
      stock.purchaseDate = purchaseDate;
      if (productLineId) {
        const productLine = await this.productLineService.findOne(
          productLineId,
        );
        stock.productLine = productLine;
      }
      if (locationId) {
        const location = await this.locationService.findOne(locationId);
        stock.location = location;
      }
      if (transportId) {
        const transport = await this.transportService.findOne(transportId);
        stock.transport = transport;
      }
      if (tyreDetailId) {
        const tyreDetail = await this.tyreDetailService.findOne(tyreDetailId);
        stock.tyreDetail = tyreDetail;
      }
      if (vendorId) {
        const vendor = await this.vendorService.findOne(vendorId);
        stock.vendor = vendor;
      }
      await this.stocksRepository.save(stock);
      return stock;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async export(stocksExportFileDto: StocksExportFileDto) {
    const parser = new Parser({
      fields: [
        'StockId',
        'ProductLineId',
        'DOM',
        'PurchaseDate',
        'PurchasedQuantity',
        'Quantity',
        'Cost',
        'SpeedRatingId',
        'LoadIndexId',
        'SoldOut',
        'TyreDetailId',
        'TransportId',
        'VendorId',
        'LocationId',
        'UserId',
        'OrdersId',
        'CreatedAt',
      ],
    });
    const stocks = await this.stocksRepository.getExportData(
      stocksExportFileDto,
    );
    const json = [];
    stocks.forEach((stock) => {
      json.push({
        StockId: stock.id,
        ProductLineId: stock.productLine,
        DOM: stock.dom,
        PurchaseDate: stock.purchaseDate,
        PurchasedQuantity: stock.purchasedQuantity,
        SpeedRatingId: stock.speedRating,
        LoadIndexId: stock.loadIndex,
        Quantity: stock.quantity,
        Cost: stock.cost,
        SoldOut: stock.soldOut,
        TyreDetailId: stock.tyreDetail,
        TransportId: stock.transport,
        VendorId: stock.vendor,
        LocationId: stock.location,
        UserId: stock.user,
        OrdersId: stock.orders,
        CreatedAt: stock.createdAt,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }

  findManyByBrandAndTyreSize(brand: string, tyreSize: string) {
    return this.stocksRepository.findManyByBrandAndTyreSize(brand, tyreSize);
  }
  findOneByBrandPatternTyreSizeSpeedRatingLoadIndex(
    brand: string,
    pattern: string,
    tyreSize: string,
    speedRating: string,
    loadIndex: number,
  ) {
    return this.stocksRepository.findOneByBrandPatternTyreSizeSpeedRatingLoadIndex(
      brand,
      pattern,
      tyreSize,
      speedRating,
      loadIndex,
    );
  }
}
