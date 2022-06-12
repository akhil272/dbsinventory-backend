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
import { ApiResponse } from 'src/utils/types/common';
import { CreateTyreDetailDto } from './dto/create-tyre-detail.dto';
import { CreateTyreDetailFromPattern } from './dto/create-tyre-from-pattern-dto';
import { GetTyreDetailsFilterDto } from './dto/get-tyre-detail-filter.dto';
import { UpdateTyreDetailDto } from './dto/update-tyre-detail.dto';
import { TyreDetail } from './entities/tyre-detail.entity';
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
    const { tyreSizeId, patternId } = createTyreDetailDto;
    const tyreSize = await this.tyreSizeService.findOne(tyreSizeId);
    const pattern = await this.patternService.findOne(patternId);
    try {
      const tyreDetail = this.tyreDetailRepository.create({
        tyreSize,
        pattern,
      });
      await this.tyreDetailRepository.save(tyreDetail);
      return tyreDetail;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add tyre to system.');
    }
  }

  async createTyreSizeWithPattern(
    createTyreDetailFromPattern: CreateTyreDetailFromPattern,
  ): Promise<TyreDetail> {
    const { tyreSizeValue, patternId } = createTyreDetailFromPattern;
    const findTyreSize = await this.tyreSizeService.findWithSize(tyreSizeValue);
    const pattern = await this.patternService.findOne(patternId);
    if (!findTyreSize) {
      const tyreSize = await this.tyreSizeService.create({ tyreSizeValue });
      try {
        const tyreDetail = this.tyreDetailRepository.create({
          tyreSize,
          pattern,
        });
        await this.tyreDetailRepository.save(tyreDetail);
        return tyreDetail;
      } catch (error) {
        throw new InternalServerErrorException('Failed to add tyre to system.');
      }
    }
    try {
      const tyreDetail = await this.create({
        tyreSizeId: findTyreSize.id,
        patternId: pattern.id,
      });
      return tyreDetail;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add tyre to system.');
    }
  }

  async findAll(
    filterDto: GetTyreDetailsFilterDto,
  ): Promise<ApiResponse<TyreDetail[]>> {
    const tyreDetails = await this.tyreDetailRepository.getTyreDetails(
      filterDto,
    );
    return {
      success: true,
      data: tyreDetails,
    };
  }

  async findOne(id: number) {
    const tyreDetail = await this.tyreDetailRepository.findOne(id);
    if (!tyreDetail) {
      throw new NotFoundException('Tyre not found in the system.');
    }
    return tyreDetail;
  }

  async update(id: number, updateTyreDetailDto: UpdateTyreDetailDto) {
    const { tyreSizeId, patternId } = updateTyreDetailDto;
    try {
      const tyreDetail = await this.findOne(id);
      const tyreSize = await this.tyreSizeService.findOne(tyreSizeId);
      tyreDetail.tyreSize = tyreSize;
      const pattern = await this.patternService.findOne(patternId);
      tyreDetail.pattern = pattern;
      await this.tyreDetailRepository.save(tyreDetail);
      return tyreDetail;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async remove(id: number) {
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
