import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LocationModule } from 'src/location/location.module';
import { PatternModule } from 'src/pattern/pattern.module';
import { TransportModule } from 'src/transport/transport.module';
import { TyreModule } from 'src/tyre/tyre.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { StocksController } from './stocks.controller';
import { StocksRepository } from './stocks.repository';
import { StocksService } from './stocks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StocksRepository]),
    AuthModule,
    PatternModule,
    TyreModule,
    TransportModule,
    VendorModule,
    LocationModule,
  ],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
