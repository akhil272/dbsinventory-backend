import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { CreateTyreSizeDto } from './dto/create-tyre-size.dto';
import { UpdateTyreSizeDto } from './dto/update-tyre-size.dto';
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

  async findAll() {
    return await this.tyreSizeRepository.find();
  }

  async findOne(id: string) {
    try {
      const tyreSize = await this.tyreSizeRepository.findOne(id);
      if (!tyreSize) {
        throw new NotFoundException('Tyre size not in the system');
      }
      return tyreSize;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(id: string, updateTyreSizeDto: UpdateTyreSizeDto) {
    try {
      const tyreSize = await this.findOne(id);
      tyreSize.size = updateTyreSizeDto.size;
      await this.tyreSizeRepository.save(tyreSize);
      return tyreSize;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update tyre size.');
    }
  }

  async remove(id: string) {
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
