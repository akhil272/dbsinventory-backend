import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQuoteService } from 'src/user-quote/user-quote.service';
import { User } from 'src/users/entities/user.entity';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { QuotationsRepository } from './quotations.repository';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(QuotationsRepository)
    private readonly quotationsRepository: QuotationsRepository,
    private readonly userQuoteService: UserQuoteService,
  ) {}
  async create(createQuotationDto: CreateQuotationDto, user: User) {
    const { userQuote } = createQuotationDto;

    const quotation = this.quotationsRepository.create({
      user,
    });
    await this.quotationsRepository.save(quotation);

    userQuote.map(async (quote) => {
      await this.userQuoteService.createQuoteWithQuotation(quote, quotation);
    });
    return quotation;
  }

  findAll() {
    return this.quotationsRepository.find({ relations: ['userQuotes'] });
  }

  findOne(id: number) {
    return this.quotationsRepository.findOne(id, { relations: ['userQuotes'] });
  }

  update(id: number, updateQuotationDto: UpdateQuotationDto) {
    return this.quotationsRepository.update(id, updateQuotationDto);
  }

  remove(id: number) {
    return `This action removes a #${id} quotation`;
  }
}
