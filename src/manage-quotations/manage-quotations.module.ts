import { Module } from '@nestjs/common';
import { PDFModule } from 'src/pdf/pdf.module';
import { QuotationsModule } from 'src/quotations/quotations.module';
import { SmsModule } from 'src/sms/sms.module';
import { UserQuoteModule } from 'src/user-quote/user-quote.module';
import { UsersModule } from 'src/users/users.module';
import { ManageQuotationsController } from './manage-quotations.controller';
import { ManageQuotationsService } from './manage-quotations.service';

@Module({
  imports: [
    UserQuoteModule,
    QuotationsModule,
    PDFModule,
    UsersModule,
    SmsModule,
  ],
  controllers: [ManageQuotationsController],
  providers: [ManageQuotationsService],
})
export class ManageQuotationsModule {}
