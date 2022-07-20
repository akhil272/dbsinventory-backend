import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
import { Quotation } from 'src/quotations/entities/quotation.entity';
import { StocksService } from 'src/stocks/stocks.service';
import { GetCsvFileDto } from 'src/users/dto/get-csv-file.dto';
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
    const {
      brandName,
      patternName,
      tyreSizeValue,
      tyreSpeedRating,
      tyreLoadIndex,
    } = userQuote;
    const exactStock =
      await this.stocksService.findOneByBrandPatternTyreSizeSpeedRatingLoadIndex(
        brandName,
        patternName,
        tyreSizeValue,
        tyreSpeedRating,
        tyreLoadIndex,
      );

    const stocks = await this.stocksService.findManyByBrandAndTyreSize(
      brandName,
      tyreSizeValue,
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

  async getCSVData(getCsvFileDto: GetCsvFileDto) {
    const parser = new Parser({
      fields: [
        'UserQuoteId',
        'Quotation',
        'BrandName',
        'PatternName',
        'TyreSizeValue',
        'Quantity',
        'TyreSpeedRating',
        'TyreLoadIndex',
        'QuotePrice',
        'UserNotes',
        'AdminComments',
      ],
    });
    const userQuotes = await this.userQuotesRepository.getCSVData(
      getCsvFileDto,
    );
    const json = [];
    userQuotes.forEach((userQuote) => {
      json.push({
        UserQuoteId: userQuote.id,
        Quotation: userQuote.quotation,
        BrandName: userQuote.brandName,
        PatternName: userQuote.patternName,
        TyreSizeValue: userQuote.tyreSizeValue,
        Quantity: userQuote.quantity,
        TyreSpeedRating: userQuote.tyreSpeedRating,
        TyreLoadIndex: userQuote.tyreLoadIndex,
        QuotePrice: userQuote.quotePrice,
        UserNotes: userQuote.userNotes,
        AdminComments: userQuote.adminComments,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
