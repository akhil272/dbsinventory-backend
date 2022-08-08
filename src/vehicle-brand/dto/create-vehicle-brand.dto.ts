import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVehicleBrandDto {
  @IsString()
  @IsNotEmpty()
  vehicleBrand: string;
}
