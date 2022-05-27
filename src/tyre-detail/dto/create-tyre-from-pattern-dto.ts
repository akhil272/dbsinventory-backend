import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateTyreDetailFromPattern {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+\/\d\dR\d\d$/, {
    message: 'Tyre Size only accepted in XXX/XXRXX example: 265/65R15',
  })
  size: string;

  @IsNotEmpty()
  @IsNumber()
  pattern_id: number;
}
