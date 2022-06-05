import { Quotation } from 'src/quotations/entities/quotation.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserQuoteDto } from './dto/create-user-quote.dto';
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
}
