import { EntityRepository, Repository } from 'typeorm';
import { Transport } from './entities/transport.entity';

@EntityRepository(Transport)
export class TransportRepository extends Repository<Transport> {}
