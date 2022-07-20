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
import { CreateTransportDto } from './dto/create-transport.dto';
import { GetTransportsFilterDto } from './dto/get-transports-filter.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { Transport } from './entities/transport.entity';
import { TransportRepository } from './transport.repository';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(TransportRepository)
    private readonly transportRepository: TransportRepository,
  ) {}

  async create(createTransportDto: CreateTransportDto) {
    const { mode } = createTransportDto;
    try {
      const transport = this.transportRepository.create({
        mode,
      });
      await this.transportRepository.save(transport);
      return transport;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Transport mode already exists in the system.',
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
    filterDto: GetTransportsFilterDto,
  ): Promise<ApiResponse<Transport[]>> {
    const transports = await this.transportRepository.getTransports(filterDto);
    return {
      success: true,
      data: transports,
    };
  }

  async findOne(id: number) {
    const transport = await this.transportRepository.findOne(id);
    if (!transport) {
      throw new NotFoundException('Transport mode not in the system');
    }
    return transport;
  }

  async update(id: number, updateTransportDto: UpdateTransportDto) {
    try {
      const transport = await this.findOne(id);
      transport.mode = updateTransportDto.mode;
      await this.transportRepository.save(transport);
      return transport;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: number) {
    try {
      return await this.transportRepository.delete(id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Transport is linked to other records. Contact system admin.',
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
      fields: ['TransportId', 'Mode', 'Stocks'],
    });
    const transports = await this.transportRepository.getCSVData();
    const json = [];
    transports.forEach((transport) => {
      json.push({
        TransportId: transport.id,
        Mode: transport.mode,
        Stocks: transport.stocks,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
