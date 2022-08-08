import { Module } from '@nestjs/common';
import { VehicleModelService } from './vehicle-model.service';
import { VehicleModelController } from './vehicle-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleModelRepository } from './vehicle-model.repository';
import { VehicleBrandModule } from 'src/vehicle-brand/vehicle-brand.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehicleModelRepository]),
    VehicleBrandModule,
  ],
  controllers: [VehicleModelController],
  providers: [VehicleModelService],
})
export class VehicleModelModule {}
