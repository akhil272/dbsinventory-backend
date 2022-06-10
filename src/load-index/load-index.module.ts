import { Module } from '@nestjs/common';
import { LoadIndexService } from './load-index.service';
import { LoadIndexController } from './load-index.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadIndexRepository } from './load-index.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LoadIndexRepository])],
  controllers: [LoadIndexController],
  providers: [LoadIndexService],
  exports: [LoadIndexService],
})
export class LoadIndexModule {}
