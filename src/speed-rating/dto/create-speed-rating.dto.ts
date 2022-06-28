import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSpeedRatingDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\(?[a-zA-Z]\)?\s\|\s[0-9]+\+?\skm\/h/i, {
    message: 'Invalid speed rating. Please enter in the format: A | 120 km/h',
  })
  value: string;
}
