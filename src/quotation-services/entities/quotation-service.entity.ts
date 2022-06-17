import { Quotation } from 'src/quotations/entities/quotation.entity';
import { Service } from 'src/services/entities/service.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuotationService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceId: number;

  @Column()
  quotationId: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  serviceNote: string;

  @ManyToOne(() => Quotation, (quotation) => quotation.quotationServices)
  quotation: Quotation;

  @ManyToOne(() => Service, (service) => service.quotationServices)
  service: Service;
}
