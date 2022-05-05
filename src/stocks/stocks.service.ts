import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationService } from 'src/location/location.service';
import { PatternService } from 'src/pattern/pattern.service';
import { TransportService } from 'src/transport/transport.service';
import { TyreService } from 'src/tyre/tyre.service';
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
    private readonly patternService: PatternService,
    private readonly tyreService: TyreService,
    private readonly transportService: TransportService,
    private readonly vendorService: VendorService,
    private readonly locationService: LocationService,
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
    const { pattern_id, transport_id, tyre_size_id, vendor_id, location_id } =
      createStockDto;
    const pattern = await this.patternService.findOne(pattern_id);
    const tyre = await this.tyreService.findOne(tyre_size_id);
    const transport = await this.transportService.findOne(transport_id);
    const vendor = await this.vendorService.findOne(vendor_id);
    const location = await this.locationService.findOne(location_id);
    return this.stocksRepository.createStock(
      createStockDto,
      user,
      pattern,
      tyre,
      transport,
      vendor,
      location,
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
