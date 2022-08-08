import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetVehicleModelFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
