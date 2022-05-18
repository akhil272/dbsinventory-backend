import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { TransportRepository } from './transport.repository';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(TransportRepository)
    private readonly transportRepo: TransportRepository,
  ) {}

  async create(createTransportDto: CreateTransportDto) {
    const { mode } = createTransportDto;
    try {
      const transport_mode = this.transportRepo.create({
        mode,
      });
      await this.transportRepo.save(transport_mode);
      return transport_mode;
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

  async findAll() {
    return await this.transportRepo.find();
  }

  async findOne(id: string) {
    try {
      const transport = await this.transportRepo.findOne(id);
      if (!transport) {
        throw new NotFoundException('Transport mode not in the system');
      }
      return transport;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async update(id: string, updateTransportDto: UpdateTransportDto) {
    try {
      const transport = await this.findOne(id);
      transport.mode = updateTransportDto.mode;
      await this.transportRepo.save(transport);
      return transport;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: string) {
    try {
      return await this.transportRepo.delete(id);
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
}
