import { VehicleModel } from 'src/vehicle-model/entities/vehicle-model.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VehicleBrand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  vehicleBrand: string;

  @OneToMany(() => VehicleModel, (vehicleModel) => vehicleModel.vehicleBrand)
  models: VehicleModel[];
}
