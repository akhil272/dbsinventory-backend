import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandRepository } from './brand.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BrandRepository])],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
