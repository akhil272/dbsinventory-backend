import { EntityRepository, Repository } from 'typeorm';
import { TyreDetail } from './entities/tyre-detail.entity';

@EntityRepository(TyreDetail)
export class TyreDetailRepository extends Repository<TyreDetail> {}
