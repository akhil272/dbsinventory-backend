import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const transport_mode = this.transportRepo.create({
      mode,
    });
    await this.transportRepo.save(transport_mode);
    return transport_mode;
  }

  findAll() {
    return `This action returns all transport`;
  }

  findOne(id: string) {
    return this.transportRepo.findOne(id);
  }

  update(id: number, updateTransportDto: UpdateTransportDto) {
    return `This action updates a #${id} transport`;
  }

  remove(id: number) {
    return `This action removes a #${id} transport`;
  }
}
