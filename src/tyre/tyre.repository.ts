import { EntityRepository, Repository } from 'typeorm';
import { Tyre } from './entities/tyre.entity';

@EntityRepository(Tyre)
export class TyreRepository extends Repository<Tyre> {}
