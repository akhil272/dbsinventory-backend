import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LocationModule } from 'src/location/location.module';
import { TransportModule } from 'src/transport/transport.module';
import { TyreDetailModule } from 'src/tyre-detail/tyre-detail.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { StocksController } from './stocks.controller';
import { StocksRepository } from './stocks.repository';
import { StocksService } from './stocks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StocksRepository]),
    AuthModule,
    TransportModule,
    VendorModule,
    LocationModule,
    TyreDetailModule,
  ],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}
