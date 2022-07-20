import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetVendorsFilterDto } from './dto/get-vendors-filter.dto';
import { Vendor } from './entities/vendor.entity';

@EntityRepository(Vendor)
export class VendorRepository extends Repository<Vendor> {
  async getVendors(filterDto: GetVendorsFilterDto): Promise<Vendor[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('vendor');
    if (search) {
      query.where('(vendor.name ILIKE :search)', { search: `%${search}%` });
    }
    try {
      const vendors = await query.getMany();
      return vendors;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCSVData() {
    const query = this.createQueryBuilder('vendor');
    try {
      const vendors = await query.loadAllRelationIds().getMany();
      return vendors;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
