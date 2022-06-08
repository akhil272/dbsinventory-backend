import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quotation } from 'src/quotations/entities/quotation.entity';
import { StocksService } from 'src/stocks/stocks.service';
import { CreateUserQuoteDto } from './dto/create-user-quote.dto';
import { UpdateUserQuoteDto } from './dto/update-user-quote.dto';
import { UserQuotesRepository } from './user-quote.repository';

@Injectable()
export class UserQuoteService {
  constructor(
    @InjectRepository(UserQuotesRepository)
    private userQuotesRepository: UserQuotesRepository,
    private stocksService: StocksService,
  ) {}

  create(createUserQuoteDto: CreateUserQuoteDto) {
    return this.userQuotesRepository.create(createUserQuoteDto);
  }

  createQuoteWithQuotation(
    createUserQuoteDto: CreateUserQuoteDto,
    quotation: Quotation,
  ) {
    return this.userQuotesRepository.createQuote(createUserQuoteDto, quotation);
  }

  findAll() {
    return this.userQuotesRepository.find();
  }

  async findOne(id: number) {
    const userQuote = await this.userQuotesRepository.findOne(id);
    if (!userQuote) {
      throw new InternalServerErrorException('User Quote not found');
    }
    const { brand, pattern, tyre_size, speed_rating, load_index } = userQuote;
    const exactStock =
      await this.stocksService.findOneByBrandPatternTyreSizeSpeedRatingLoadIndex(
        brand,
        pattern,
        tyre_size,
        speed_rating,
        load_index,
      );

    const stocks = await this.stocksService.findManyByBrandAndTyreSize(
      brand,
      tyre_size,
    );
    return { userQuote, stocks, exactStock };
  }

  async update(id: number, updateUserQuoteDto: UpdateUserQuoteDto) {
    const userQuoteWithPrice =
      await this.userQuotesRepository.updateQuoteAndQuotationPrice(
        id,
        updateUserQuoteDto,
      );

    return userQuoteWithPrice;
  }

  remove(id: number) {
    return `This action removes a #${id} userQuote`;
  }
}
