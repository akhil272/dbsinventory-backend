import { EntityRepository, Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';

@EntityRepository(Vendor)
export class VendorRepository extends Repository<Vendor> {}
