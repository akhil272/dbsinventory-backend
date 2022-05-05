import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorRepository } from './vendor.repository';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(VendorRepository)
    private readonly vendorRepo: VendorRepository,
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    const { name } = createVendorDto;
    const vendor = this.vendorRepo.create({
      name,
    });
    await this.vendorRepo.save(vendor);
    return vendor;
  }

  findAll() {
    return `This action returns all vendor`;
  }

  findOne(id: string) {
    return this.vendorRepo.findOne(id);
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
