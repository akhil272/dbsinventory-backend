import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorRepository } from './vendor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VendorRepository])],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}
