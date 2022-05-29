import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import LocalFile from './entities/local-file.entity';
import LocalFilesService from './local-files.service';
import LocalFilesController from './local-files.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LocalFile]), ConfigModule],
  providers: [LocalFilesService],
  exports: [LocalFilesService],
  controllers: [LocalFilesController],
})
export class LocalFilesModule {}
