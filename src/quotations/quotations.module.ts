import { Module } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsRepository } from './quotations.repository';
import { UserQuoteModule } from 'src/user-quote/user-quote.module';
import { CustomersModule } from 'src/customers/customers.module';
import { ServicesModule } from 'src/services/services.module';
import { QuotationServicesModule } from 'src/quotation-services/quotation-services.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuotationsRepository]),
    UserQuoteModule,
    CustomersModule,
    ServicesModule,
    QuotationServicesModule,
    UsersModule,
    NotificationModule,
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
