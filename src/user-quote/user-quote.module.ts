import { Module } from '@nestjs/common';
import { UserQuoteService } from './user-quote.service';
import { UserQuoteController } from './user-quote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQuotesRepository } from './user-quote.repository';
import { StocksModule } from 'src/stocks/stocks.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserQuotesRepository]), StocksModule],
  controllers: [UserQuoteController],
  providers: [UserQuoteService],
  exports: [UserQuoteService],
})
export class UserQuoteModule {}
