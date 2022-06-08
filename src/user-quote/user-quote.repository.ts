import { InternalServerErrorException } from '@nestjs/common';
import { Quotation } from 'src/quotations/entities/quotation.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserQuoteDto } from './dto/create-user-quote.dto';
import { UpdateUserQuoteDto } from './dto/update-user-quote.dto';
import { UserQuote } from './entities/user-quote.entity';

@EntityRepository(UserQuote)
export class UserQuotesRepository extends Repository<UserQuote> {
  async createQuote(
    createUserQuoteDto: CreateUserQuoteDto,
    quotation: Quotation,
  ) {
    const userQuotation = this.create({
      ...createUserQuoteDto,
      quotation,
    });
    await this.save(userQuotation);
    return userQuotation;
  }

  async updateQuoteAndQuotationPrice(
    id: number,
    updateUserQuoteDto: UpdateUserQuoteDto,
  ): Promise<{ userQuote: UserQuote; price: number }> {
    const query = this.createQueryBuilder('userQuote');
    query.leftJoinAndSelect('userQuote.quotation', 'quotation');
    const userQuote = await query.where('userQuote.id = :id', { id }).getOne();
    if (!userQuote) {
      throw new InternalServerErrorException('User Quote not found');
    }
    userQuote.price = updateUserQuoteDto.price;
    userQuote.admin_comments = updateUserQuoteDto.admin_comments;
    await this.save(userQuote);
    const quotationId = userQuote.quotation.id;
    const userQuotes = await query
      .where('quotation.id = :quotationId', {
        quotationId,
      })
      .getMany();
    const totalPrice = userQuotes
      .map((userQuote) => userQuote.price)
      .reduce((a, b) => a + b, 0);
    return { userQuote, price: totalPrice };
  }
}
