import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { ApiResponse } from 'src/utils/types/common';
import { CreateTyreSizeDto } from './dto/create-tyre-size.dto';
import { GetTyreSizeFilterDto } from './dto/get-tyre-size-filter.dto';
import { UpdateTyreSizeDto } from './dto/update-tyre-size.dto';
import { TyreSize } from './entities/tyre-size.entity';
import { TyreSizeRepository } from './tyre-size.repository';

@Injectable()
export class TyreSizeService {
  constructor(
    @InjectRepository(TyreSizeRepository)
    private readonly tyreSizeRepository: TyreSizeRepository,
  ) {}

  async create(createTyreSizeDto: CreateTyreSizeDto) {
    const { tyreSizeValue } = createTyreSizeDto;
    try {
      const tyreSize = this.tyreSizeRepository.create({
        value: tyreSizeValue,
      });
      await this.tyreSizeRepository.save(tyreSize);
      return tyreSize;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Tyre Size already exists in the system.',
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
    filterDto: GetTyreSizeFilterDto,
  ): Promise<ApiResponse<TyreSize[]>> {
    const tyreSizes = await this.tyreSizeRepository.getTyreSizes(filterDto);
    return {
      success: true,
      data: tyreSizes,
    };
  }

  async findOne(id: number) {
    const tyreSize = await this.tyreSizeRepository.findOne(id);
    if (!tyreSize) {
      throw new NotFoundException('Tyre size not in the system');
    }
    return tyreSize;
  }

  async findWithSize(value: string): Promise<TyreSize> {
    const tyreSize = await this.tyreSizeRepository.findOne({ value });
    return tyreSize;
  }

  async update(id: number, updateTyreSizeDto: UpdateTyreSizeDto) {
    try {
      const tyreSize = await this.findOne(id);
      tyreSize.value = updateTyreSizeDto.tyreSizeValue;
      await this.tyreSizeRepository.save(tyreSize);
      return tyreSize;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update tyre size.');
    }
  }

  async remove(id: number) {
    try {
      return await this.tyreSizeRepository.delete(id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Tyre size is linked to other records. Contact system admin.',
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
      fields: ['TyreSizeId', 'Value', 'TyreDetails'],
    });
    const tyreSizes = await this.tyreSizeRepository.getCSVData();
    const json = [];
    tyreSizes.forEach((tyreSize) => {
      json.push({
        TyreSizeId: tyreSize.id,
        Value: tyreSize.value,
        TyreDetails: tyreSize.tyreDetails,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
