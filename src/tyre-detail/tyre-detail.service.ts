import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { PatternService } from 'src/pattern/pattern.service';
import { TyreSizeService } from 'src/tyre-size/tyre-size.service';
import { CreateTyreDetailDto } from './dto/create-tyre-detail.dto';
import { UpdateTyreDetailDto } from './dto/update-tyre-detail.dto';
import { TyreDetailRepository } from './tyre-detail.repository';

@Injectable()
export class TyreDetailService {
  constructor(
    @InjectRepository(TyreDetailRepository)
    private readonly tyreDetailRepository: TyreDetailRepository,
    private readonly tyreSizeService: TyreSizeService,
    private readonly patternService: PatternService,
  ) {}

  async create(createTyreDetailDto: CreateTyreDetailDto) {
    const { tyre_size_id, pattern_id } = createTyreDetailDto;
    const tyreSize = await this.tyreSizeService.findOne(tyre_size_id);
    const pattern = await this.patternService.findOne(pattern_id);
    try {
      const tyreDetail = this.tyreDetailRepository.create({
        tyreSize,
        pattern,
      });
      await this.tyreDetailRepository.save(tyreDetail);
      return tyreDetail;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to add pattern to system.',
      );
    }
  }

  async findAll() {
    return await this.tyreDetailRepository.find();
  }

  async findOne(id: string) {
    try {
      const tyreDetail = await this.tyreDetailRepository.findOne(id);
      if (!tyreDetail) {
        throw new NotFoundException('Tyre not found in the system.');
      }
      return tyreDetail;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(id: string, updateTyreDetailDto: UpdateTyreDetailDto) {
    const { tyre_size_id, pattern_id } = updateTyreDetailDto;
    try {
      const tyreDetail = await this.findOne(id);
      const tyreSize = await this.tyreSizeService.findOne(tyre_size_id);
      tyreDetail.tyreSize = tyreSize;
      const pattern = await this.patternService.findOne(pattern_id);
      tyreDetail.pattern = pattern;
      await this.tyreDetailRepository.save(tyreDetail);
      return tyreDetail;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async remove(id: string) {
    try {
      return await this.tyreDetailRepository.delete(id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Tyre is linked to other records. Contact system admin.',
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
