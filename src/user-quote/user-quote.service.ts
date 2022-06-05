import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return this.userQuotesRepository.findOne(id);
  }

  update(id: number, updateUserQuoteDto: UpdateUserQuoteDto) {
    return `This action updates a #${id} userQuote`;
  }

  remove(id: number) {
    return `This action removes a #${id} userQuote`;
  }
}
