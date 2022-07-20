import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { ApiResponse } from 'src/utils/types/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { GetVendorsFilterDto } from './dto/get-vendors-filter.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';
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

  async findAll(
    filterDto: GetVendorsFilterDto,
  ): Promise<ApiResponse<Vendor[]>> {
    const vendors = await this.vendorRepo.getVendors(filterDto);
    return {
      success: true,
      data: vendors,
    };
  }

  async findOne(id: number) {
    const vendor = await this.vendorRepo.findOne(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found in the system');
    }
    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
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

  async remove(id: number) {
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

  async getCSVData() {
    const parser = new Parser({
      fields: ['VendorId', 'Name', 'Stocks'],
    });
    const vendors = await this.vendorRepo.getCSVData();
    const json = [];
    vendors.forEach((vendor) => {
      json.push({
        VendorId: vendor.id,
        Name: vendor.name,
        Stocks: vendor.stocks,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
