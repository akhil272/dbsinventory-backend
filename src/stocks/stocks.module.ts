import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LoadIndexModule } from 'src/load-index/load-index.module';
import { LocationModule } from 'src/location/location.module';
import { ProductLineModule } from 'src/product-line/product-line.module';
import { SpeedRatingModule } from 'src/speed-rating/speed-rating.module';
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
    LoadIndexModule,
    SpeedRatingModule,
    ProductLineModule,
  ],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}
