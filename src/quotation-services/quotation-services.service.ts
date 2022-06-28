import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quotation } from 'src/quotations/entities/quotation.entity';
import { ServicesService } from 'src/services/services.service';
import { CreateQuotationServiceDto } from './dto/create-quotation-service.dto';
import { UpdateQuotationServiceDto } from './dto/update-quotation-service.dto';
import { QuotationServicesRepository } from './quotation-services.repository';

@Injectable()
export class QuotationServicesService {
  constructor(
    @InjectRepository(QuotationServicesRepository)
    private readonly quotationServicesRepository: QuotationServicesRepository,
    private readonly servicesService: ServicesService,
  ) {}
  create(createQuotationServiceDto: CreateQuotationServiceDto) {
    return this.quotationServicesRepository.create(createQuotationServiceDto);
  }

  findAll() {
    return this.quotationServicesRepository.find();
  }

  findOne(id: number) {
    return this.quotationServicesRepository.findOne(id);
  }

  update(id: number, updateQuotationServiceDto: UpdateQuotationServiceDto) {
    return this.quotationServicesRepository.update(
      id,
      updateQuotationServiceDto,
    );
  }

  remove(id: number) {
    return this.quotationServicesRepository.delete(id);
  }

  async createQuotationService(id: number, quotation: Quotation) {
    const service = await this.servicesService.findOne(id);
    const quotationService = this.quotationServicesRepository.create({
      service,
      quotation,
    });
    return await this.quotationServicesRepository.save(quotationService);
  }
}
