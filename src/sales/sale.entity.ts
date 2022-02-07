import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sale_data: Date;

  @Column()
  quantity: number;

  @Column()
  username: string;
}
