import { Module } from '@nestjs/common';
import { QuotationServicesService } from './quotation-services.service';
import { QuotationServicesController } from './quotation-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from 'src/services/services.module';
import { QuotationServicesRepository } from './quotation-services.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuotationServicesRepository]),
    ServicesModule,
  ],
  controllers: [QuotationServicesController],
  providers: [QuotationServicesService],
  exports: [QuotationServicesService],
})
export class QuotationServicesModule {}
