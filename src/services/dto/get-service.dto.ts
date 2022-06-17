import { IsNumber, IsOptional } from 'class-validator';

export class GetServiceDto {
  @IsOptional()
  @IsNumber()
  id: number;
}
