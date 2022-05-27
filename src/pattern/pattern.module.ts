import { Module } from '@nestjs/common';
import { PatternService } from './pattern.service';
import { PatternController } from './pattern.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatternRepository } from './pattern.repository';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([PatternRepository]), BrandModule],
  controllers: [PatternController],
  providers: [PatternService],
  exports: [PatternService],
})
export class PatternModule {}
