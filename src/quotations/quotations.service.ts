import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQuoteService } from 'src/user-quote/user-quote.service';
import { User } from 'src/users/entities/user.entity';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { GetQuotationsFilterDto } from './dto/get-quotations-filter.dto';
import { QuotationsResponseDto } from './dto/quotation-response.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { Quotation } from './entities/quotation.entity';
import { QuotationsRepository } from './quotations.repository';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(QuotationsRepository)
    private readonly quotationsRepository: QuotationsRepository,
    private readonly userQuoteService: UserQuoteService,
  ) {}
  async create(createQuotationDto: CreateQuotationDto, user: User) {
    const { userQuotes } = createQuotationDto;
    const count = userQuotes.length;
    const quotation = this.quotationsRepository.create({
      user,
      count,
    });
    await this.quotationsRepository.save(quotation);

    userQuotes.map(async (quote) => {
      await this.userQuoteService.createQuoteWithQuotation(quote, quotation);
    });
    return quotation;
  }

  async findAll(
    filterDto: GetQuotationsFilterDto,
  ): Promise<QuotationsResponseDto> {
    return this.quotationsRepository.getQuotations(filterDto);
  }

  findOne(id: number) {
    return this.quotationsRepository.findQuoteById(id);
  }

  async update(id: number, updateQuotationDto: UpdateQuotationDto) {
    const quotation = await this.quotationsRepository.findOne(id);
    if (!quotation) {
      throw new InternalServerErrorException('Quotation not found');
    }
    return await this.quotationsRepository.update(id, updateQuotationDto);
  }

  remove(id: number) {
    return `This action removes a #${id} quotation`;
  }

  async updateTotalPrice(totalPrice: number, id: number) {
    const quotation = await this.quotationsRepository.findOne(id);
    if (!quotation) {
      throw new InternalServerErrorException('Quotation not found');
    }
    quotation.price = totalPrice;
    await this.quotationsRepository.save(quotation);
    return quotation;
  }

  async updateQuotationStatus(quotation: Quotation): Promise<Quotation> {
    return await this.quotationsRepository.save(quotation);
  }
}
