import { Module } from '@nestjs/common';
import { TyreService } from './tyre.service';
import { TyreController } from './tyre.controller';
import { TyreRepository } from './tyre.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TyreRepository])],
  controllers: [TyreController],
  providers: [TyreService],
  exports: [TyreService],
})
export class TyreModule {}
