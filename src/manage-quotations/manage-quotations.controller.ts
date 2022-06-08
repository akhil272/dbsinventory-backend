import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateUserQuoteDto } from 'src/user-quote/dto/update-user-quote.dto';
import { ManageQuotationsService } from './manage-quotations.service';

@Controller('manage-quotations')
export class ManageQuotationsController {
  constructor(
    private readonly manageQuotationsService: ManageQuotationsService,
  ) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserQuoteDto: UpdateUserQuoteDto,
  ) {
    return this.manageQuotationsService.updateQuotationPriceWithUserQuote(
      +id,
      updateUserQuoteDto,
    );
  }
}
