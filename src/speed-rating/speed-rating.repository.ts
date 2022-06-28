import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetSpeedRatingsFilterDto } from './dto/get-speed-ratings-filter.dto';
import { SpeedRating } from './entities/speed-rating.entity';

@EntityRepository(SpeedRating)
export class SpeedRatingRepository extends Repository<SpeedRating> {
  async getSpeedRatings(
    filterDto: GetSpeedRatingsFilterDto,
  ): Promise<SpeedRating[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('speed-rating');
    if (search) {
      query.where('(speed_rating.value ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    try {
      const speedRatings = await query.getMany();
      return speedRatings;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
