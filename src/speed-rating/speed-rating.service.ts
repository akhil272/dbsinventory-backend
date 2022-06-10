import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/utils/types/common';
import { CreateSpeedRatingDto } from './dto/create-speed-rating.dto';
import { GetSpeedRatingsFilterDto } from './dto/get-speed-ratings-filter.dto';
import { UpdateSpeedRatingDto } from './dto/update-speed-rating.dto';
import { SpeedRating } from './entities/speed-rating.entity';
import { SpeedRatingRepository } from './speed-rating.repository';

@Injectable()
export class SpeedRatingService {
  constructor(
    @InjectRepository(SpeedRatingRepository)
    private readonly speedRatingRepository: SpeedRatingRepository,
  ) {}
  async create(createSpeedRatingDto: CreateSpeedRatingDto) {
    const speed_rating = this.speedRatingRepository.create({
      ...createSpeedRatingDto,
    });
    await this.speedRatingRepository.save(speed_rating);
    return speed_rating;
  }

  async findAll(
    filterDto: GetSpeedRatingsFilterDto,
  ): Promise<ApiResponse<SpeedRating[]>> {
    const speedRatings = await this.speedRatingRepository.getSpeedRatings(
      filterDto,
    );
    return {
      success: true,
      data: speedRatings,
    };
  }

  findOne(id: number) {
    return this.speedRatingRepository.findOne(id);
  }

  update(id: number, updateSpeedRatingDto: UpdateSpeedRatingDto) {
    return `This action updates a #${id} speedRating`;
  }

  remove(id: number) {
    return `This action removes a #${id} speedRating`;
  }
}
