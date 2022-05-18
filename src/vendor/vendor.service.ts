import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
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
    try {
      const vendor = this.vendorRepo.create({
        name,
      });
      await this.vendorRepo.save(vendor);
      return vendor;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Vendor already exists in the system.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.vendorRepo.find();
  }

  async findOne(id: string) {
    try {
      const vendor = await this.vendorRepo.findOne(id);
      if (!vendor) {
        throw new NotFoundException('Vendor not found in the system');
      }
      return vendor;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateVendorDto: UpdateVendorDto) {
    try {
      const vendor = await this.findOne(id);
      vendor.name = updateVendorDto.name;
      await this.vendorRepo.save(vendor);
      return vendor;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      return await this.vendorRepo.delete(id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Vendor is linked to other records. Contact system admin.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
