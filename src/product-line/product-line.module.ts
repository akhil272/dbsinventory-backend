import { Module } from '@nestjs/common';
import { ProductLineService } from './product-line.service';
import { ProductLineController } from './product-line.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductLineRepository } from './product-line.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductLineRepository])],
  controllers: [ProductLineController],
  providers: [ProductLineService],
  exports: [ProductLineService],
})
export class ProductLineModule {}
