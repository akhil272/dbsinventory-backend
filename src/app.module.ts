import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StocksModule } from './stocks/stocks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { BrandModule } from './brand/brand.module';
import { PatternModule } from './pattern/pattern.module';
import { TransportModule } from './transport/transport.module';
import { LocationModule } from './location/location.module';
import { VendorModule } from './vendor/vendor.module';
import { TyreSizeModule } from './tyre-size/tyre-size.module';
import { TyreDetailModule } from './tyre-detail/tyre-detail.module';
import { SmsModule } from './sms/sms.module';
import { LocalFilesModule } from './local-files/local-files.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
    StocksModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    BrandModule,
    PatternModule,
    TransportModule,
    LocationModule,
    VendorModule,
    TyreSizeModule,
    TyreDetailModule,
    SmsModule,
    LocalFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
