import { Injectable } from '@nestjs/common';
import { QuotationsService } from 'src/quotations/quotations.service';
import { UpdateUserQuoteDto } from 'src/user-quote/dto/update-user-quote.dto';
import { UserQuoteService } from 'src/user-quote/user-quote.service';

@Injectable()
export class ManageQuotationsService {
  constructor(
    private readonly userQuoteService: UserQuoteService,
    private readonly quotationsService: QuotationsService,
  ) {}

  async updateQuotationPriceWithUserQuote(
    id: number,
    updateUserQuoteDto: UpdateUserQuoteDto,
  ) {
    const userQuoteWithPrice = await this.userQuoteService.update(
      id,
      updateUserQuoteDto,
    );

    const quotation = await this.quotationsService.updateTotalPrice(
      userQuoteWithPrice.price,
      userQuoteWithPrice.userQuote.quotation.id,
    );
    return quotation;
  }
}
