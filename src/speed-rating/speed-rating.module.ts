import { Module } from '@nestjs/common';
import { SpeedRatingService } from './speed-rating.service';
import { SpeedRatingController } from './speed-rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeedRatingRepository } from './speed-rating.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SpeedRatingRepository])],
  controllers: [SpeedRatingController],
  providers: [SpeedRatingService],
  exports: [SpeedRatingService],
})
export class SpeedRatingModule {}
