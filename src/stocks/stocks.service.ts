import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { LocationService } from 'src/location/location.service';
import { TransportService } from 'src/transport/transport.service';
import { TyreDetailService } from 'src/tyre-detail/tyre-detail.service';
import { User } from 'src/users/entities/user.entity';
import { VendorService } from 'src/vendor/vendor.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { GetStocksFilterDto } from './dto/get-stocks-filter.dto';
import { StocksMetaDto } from './dto/stocks-meta-dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Stock } from './stock.entity';
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
    const { transport_id, tyre_detail_id, vendor_id, location_id } =
      createStockDto;
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
    return this.stocksRepository.createStock(
      createStockDto,
      user,
      transport,
      vendor,
      location,
      tyreDetail,
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
}
