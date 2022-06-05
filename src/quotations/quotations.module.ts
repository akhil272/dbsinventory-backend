import { Module } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsRepository } from './quotations.repository';
import { UserQuoteModule } from 'src/user-quote/user-quote.module';

@Module({
  imports: [TypeOrmModule.forFeature([QuotationsRepository]), UserQuoteModule],
  controllers: [QuotationsController],
  providers: [QuotationsService],
})
export class QuotationsModule {}
