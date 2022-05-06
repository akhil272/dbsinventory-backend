import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StocksModule } from './stocks/stocks.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
        };
      },
    }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
