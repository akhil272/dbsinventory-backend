import { Module } from '@nestjs/common';
import { TyreDetailService } from './tyre-detail.service';
import { TyreDetailController } from './tyre-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TyreDetailRepository } from './tyre-detail.repository';
import { PatternModule } from 'src/pattern/pattern.module';
import { TyreSizeModule } from 'src/tyre-size/tyre-size.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TyreDetailRepository]),
    PatternModule,
    TyreSizeModule,
  ],
  controllers: [TyreDetailController],
  providers: [TyreDetailService],
  exports: [TyreDetailService],
})
export class TyreDetailModule {}
