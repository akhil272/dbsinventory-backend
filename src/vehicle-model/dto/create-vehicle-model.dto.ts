import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateVehicleModelDto {
  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  vehicleBrandId: number;
}
