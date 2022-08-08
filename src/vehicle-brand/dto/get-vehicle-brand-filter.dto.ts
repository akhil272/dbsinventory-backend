import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetVehicleBrandFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
