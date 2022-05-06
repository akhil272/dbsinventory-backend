import { IsNotEmpty } from 'class-validator';

export class CreateTyreDetailDto {
  @IsNotEmpty()
  tyre_size_id: string;

  @IsNotEmpty()
  pattern_id: string;
}
