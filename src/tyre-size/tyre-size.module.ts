import { Module } from '@nestjs/common';
import { TyreSizeService } from './tyre-size.service';
import { TyreSizeController } from './tyre-size.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TyreSizeRepository } from './tyre-size.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TyreSizeRepository])],
  controllers: [TyreSizeController],
  providers: [TyreSizeService],
  exports: [TyreSizeService],
})
export class TyreSizeModule {}
