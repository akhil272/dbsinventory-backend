import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTyreDetailFromPattern {
  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsNumber()
  pattern_id: number;
}
