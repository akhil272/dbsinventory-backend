import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { ApiResponse } from 'src/utils/types/common';
import { CreateTyreSizeDto } from './dto/create-tyre-size.dto';
import { GetTyreSizeFilterDto } from './dto/get-tyre-size-filter.dto';
import { UpdateTyreSizeDto } from './dto/update-tyre-size.dto';
import { TyreSize } from './entities/tyre-size.entity';
import { TyreSizeRepository } from './tyre-size.respository';

@Injectable()
export class TyreSizeService {
  constructor(
    @InjectRepository(TyreSizeRepository)
    private readonly tyreSizeRepository: TyreSizeRepository,
  ) {}

  async create(createTyreSizeDto: CreateTyreSizeDto) {
    const { size } = createTyreSizeDto;
    try {
      const tyreSize = this.tyreSizeRepository.create({
        size,
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

  async findWithSize(size: string): Promise<TyreSize> {
    const tyreSize = await this.tyreSizeRepository.findOne({ size });
    return tyreSize;
  }

  async update(id: number, updateTyreSizeDto: UpdateTyreSizeDto) {
    try {
      const tyreSize = await this.findOne(id);
      tyreSize.size = updateTyreSizeDto.size;
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
}
