import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateTyreSizeDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+\/\d\dR\d\d$/)
  size: string;
}
