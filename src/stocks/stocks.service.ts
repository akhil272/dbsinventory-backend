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
import { SpeedRatingService } from 'src/speed-rating/speed-rating.service';
import { TransportService } from 'src/transport/transport.service';
import { TyreDetailService } from 'src/tyre-detail/tyre-detail.service';
import { User } from 'src/users/entities/user.entity';
import { VendorService } from 'src/vendor/vendor.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { StocksExportFileDto } from './dto/stocks-export-file-dto';
import { StocksMetaDto } from './dto/stocks-meta-dto';
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

  getStocks(filterDto: GetStocksFilterDto): Promise<StocksMetaDto> {
    return this.stocksRepository.getStocks(filterDto);
  }

  async createStock(
    createStockDto: CreateStockDto,
    user: User,
  ): Promise<Stock> {
    const {
      transport_id,
      tyre_detail_id,
      vendor_id,
      location_id,
      speed_rating_id,
      load_index_id,
    } = createStockDto;
    const transport = await this.transportService.findOne(transport_id);
    if (!transport) {
      throw new NotFoundException(
        `Transport with ID "${transport_id}" not found`,
      );
    }
    const vendor = await this.vendorService.findOne(vendor_id);
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID "${vendor_id}" not found`);
    }
    const location = await this.locationService.findOne(location_id);
    if (!location) {
      throw new NotFoundException(
        `Location with ID "${location_id}" not found`,
      );
    }
    const tyreDetail = await this.tyreDetailService.findOne(tyre_detail_id);
    if (!tyreDetail) {
      throw new NotFoundException(`Tyre with ID "${tyre_detail_id}" not found`);
    }

    const speed_rating = await this.speedRatingService.findOne(speed_rating_id);
    const load_index = await this.loadIndexService.findOne(load_index_id);

    return this.stocksRepository.createStock(
      createStockDto,
      user,
      transport,
      vendor,
      location,
      tyreDetail,
      speed_rating,
      load_index,
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
    user: User,
  ): Promise<Stock> {
    const {
      quantity,
      cost,
      dom,
      location_id,
      product_line,
      purchase_date,
      transport_id,
      tyre_detail_id,
      vendor_id,
    } = updateStockDto;
    const stock = await this.getStockById(id);
    try {
      stock.quantity = quantity;
      stock.cost = cost;
      stock.dom = dom;
      (stock.product_line = product_line),
        (stock.purchase_date = purchase_date);
      if (location_id) {
        const location = await this.locationService.findOne(location_id);
        stock.location = location;
      }
      if (transport_id) {
        const transport = await this.transportService.findOne(transport_id);
        stock.transport = transport;
      }
      if (tyre_detail_id) {
        const tyreDetail = await this.tyreDetailService.findOne(tyre_detail_id);
        stock.tyreDetail = tyreDetail;
      }
      if (vendor_id) {
        const vendor = await this.vendorService.findOne(vendor_id);
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
        'Stock_Id',
        'Product_Line',
        'DOM',
        'Purchase_Date',
        'Purchased_Quantity',
        'Speed_Rating',
        'Load_Index',
        'Quantity',
        'Cost',
        'Sold_Out',
        'TyreDetail_Id',
        'Transport_Id',
        'Vendor_Id',
        'Location_Id',
        'User_Id',
        'Orders_Id',
        'Created_At',
      ],
    });
    const stocks = await this.stocksRepository.getExportData(
      stocksExportFileDto,
    );
    const json = [];
    stocks.forEach((stock) => {
      json.push({
        Stock_Id: stock.id,
        Product_Line: stock.product_line,
        DOM: stock.dom,
        Purchase_Date: stock.purchase_date,
        Purchased_Quantity: stock.purchased_quantity,
        Speed_rating: stock.speed_rating,
        Load_Index: stock.load_index,
        Quantity: stock.quantity,
        Cost: stock.cost,
        Sold_Out: stock.sold_out,
        TyreDetail_Id: stock.tyreDetail,
        Transport_Id: stock.transport,
        Vendor_Id: stock.vendor,
        Location_Id: stock.location,
        User_Id: stock.user,
        Orders_Id: stock.orders,
        Created_At: stock.created_at,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }

  findManyByBrandAndTyreSize(brand: string, tyre_size: string) {
    return this.stocksRepository.findManyByBrandAndTyreSize(brand, tyre_size);
  }
  findOneByBrandPatternTyreSizeSpeedRatingLoadIndex(
    brand: string,
    pattern: string,
    tyre_size: string,
    speed_rating: string,
    load_index: number,
  ) {
    return this.stocksRepository.findOneByBrandPatternTyreSizeSpeedRatingLoadIndex(
      brand,
      pattern,
      tyre_size,
      speed_rating,
      load_index,
    );
  }
}
