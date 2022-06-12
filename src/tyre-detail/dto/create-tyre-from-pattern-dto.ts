import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateTyreDetailFromPattern {
  @IsNotEmpty()
  @IsString()
  tyreSizeValue: string;

  @IsNotEmpty()
  @IsNumber()
  patternId: number;
}
