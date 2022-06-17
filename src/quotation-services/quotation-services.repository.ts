import { EntityRepository, Repository } from 'typeorm';
import { QuotationService } from './entities/quotation-service.entity';

@EntityRepository(QuotationService)
export class QuotationServicesRepository extends Repository<QuotationService> {}
