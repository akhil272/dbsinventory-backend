import { PartialType } from '@nestjs/mapped-types';
import { CreateSpeedRatingDto } from './create-speed-rating.dto';

export class UpdateSpeedRatingDto extends PartialType(CreateSpeedRatingDto) {}
