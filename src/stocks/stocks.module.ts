import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StocksController } from './stocks.controller';
import { StocksRepository } from './stocks.repository';
import { StocksService } from './stocks.service';

@Module({
  imports: [TypeOrmModule.forFeature([StocksRepository]), AuthModule],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
