import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async getStockById(id: string): Promise<Stock> {
    const found = await this.stocksRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(
        `Stock with ID "${id}" was not found in the database`,
      );
    }
    return found;
  }

  async getStocks(filterDto: GetStocksFilterDto): Promise<StocksMetaDto> {
    return this.stocksRepository.getStocks(filterDto);
  }

  async createStock(
    createStockDto: CreateStockDto,
    user: User,
  ): Promise<Stock> {
    const { transport_id, tyre_detail_id, vendor_id, location_id } =
      createStockDto;
    const transport = await this.transportService.findOne(transport_id);
    const vendor = await this.vendorService.findOne(vendor_id);
    const location = await this.locationService.findOne(location_id);
    const tyreDetail = await this.tyreDetailService.findOne(tyre_detail_id);
    return this.stocksRepository.createStock(
      createStockDto,
      user,
      transport,
      vendor,
      location,
      tyreDetail,
    );
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

    await this.stocksRepository.save(stock);
    return stock;
  }
}
