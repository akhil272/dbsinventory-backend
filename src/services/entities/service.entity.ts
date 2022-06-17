import { QuotationService } from 'src/quotation-services/entities/quotation-service.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => QuotationService,
    (quotationService) => quotationService.service,
  )
  quotationServices: QuotationService[];
}
