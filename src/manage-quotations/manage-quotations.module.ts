import { Module } from '@nestjs/common';
import { QuotationsModule } from 'src/quotations/quotations.module';
import { UserQuoteModule } from 'src/user-quote/user-quote.module';
import { ManageQuotationsController } from './manage-quotations.controller';
import { ManageQuotationsService } from './manage-quotations.service';

@Module({
  imports: [UserQuoteModule, QuotationsModule],
  controllers: [ManageQuotationsController],
  providers: [ManageQuotationsService],
})
export class ManageQuotationsModule {}
