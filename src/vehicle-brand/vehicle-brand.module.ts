import { Module } from '@nestjs/common';
import { VehicleBrandService } from './vehicle-brand.service';
import { VehicleBrandController } from './vehicle-brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleBrandRepository } from './vehicle-brand.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleBrandRepository])],
  controllers: [VehicleBrandController],
  providers: [VehicleBrandService],
  exports: [VehicleBrandService],
})
export class VehicleBrandModule {}
