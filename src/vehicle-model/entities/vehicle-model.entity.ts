import { VehicleBrand } from 'src/vehicle-brand/entities/vehicle-brand.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VehicleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @ManyToOne(() => VehicleBrand, (vehicleBrand) => vehicleBrand.models)
  vehicleBrand: VehicleBrand;
}
