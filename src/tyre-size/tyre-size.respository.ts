import { EntityRepository, Repository } from 'typeorm';
import { TyreSize } from './entities/tyre-size.entity';

@EntityRepository(TyreSize)
export class TyreSizeRepository extends Repository<TyreSize> {}
