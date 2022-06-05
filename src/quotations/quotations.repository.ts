import { InjectRepository } from '@nestjs/typeorm';
import { UserQuote } from 'src/user-quote/entities/user-quote.entity';
import { UserQuotesRepository } from 'src/user-quote/user-quote.repository';
import { EntityRepository, Repository } from 'typeorm';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { Quotation } from './entities/quotation.entity';

@EntityRepository(Quotation)
export class QuotationsRepository extends Repository<Quotation> {}
