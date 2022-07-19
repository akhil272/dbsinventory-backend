import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetOverviewDto } from 'src/manage-quotations/dto/get-overview.dto';
import { EntityRepository, Repository } from 'typeorm';
import { GetQuotationsFilterDto } from './dto/get-quotations-filter.dto';
import { QuotationsResponseDto } from './dto/quotation-response.dto';
import { Quotation } from './entities/quotation.entity';
import { Status } from './entities/status.enum';

@EntityRepository(Quotation)
export class QuotationsRepository extends Repository<Quotation> {
  async getQuotations(
    filterDto: GetQuotationsFilterDto,
  ): Promise<QuotationsResponseDto> {
    const {
      take = 25,
      page = 1,
      status,
      sortBy,
      search,
      customerCategory,
      isUserDeleted,
    } = filterDto;
    const query = this.createQueryBuilder('quotation').withDeleted();
    const skip = (page - 1) * take;
    const count = await query.getCount();
    if (count <= 0) {
      throw new NotFoundException('No quotations available.');
    }
    query
      .select([
        'quotation.id',
        'quotation.status',
        'quotation.price',
        'quotation.createdAt',
        'quotation.count',
        'quotation.notes',
        'quotation.validity',
        'customer.id',
        'user.firstName',
        'user.lastName',
        'user.phoneNumber',
        'user.deletedAt',
        'customerCategory.name',
      ])
      .leftJoin('quotation.customer', 'customer')
      .leftJoinAndSelect('quotation.quotationServices', 'quotationServices')
      .leftJoinAndSelect('quotationServices.service', 'service')
      .leftJoin('customer.customerCategory', 'customerCategory')
      .leftJoin('customer.user', 'user')
      .loadRelationCountAndMap(
        'customer.quotationsCount',
        'customer.quotations',
      );
    if (status) {
      query.andWhere('quotation.status = :status', { status });
    }
    if (customerCategory) {
      query.andWhere('customerCategory.name = :customerCategory', {
        customerCategory,
      });
    }
    if (sortBy) {
      if (sortBy === 'ASC') {
        query.orderBy('quotation.createdAt', 'ASC');
      }
      if (sortBy === 'DESC') {
        query.orderBy('quotation.createdAt', 'DESC');
      }
    }

    if (isUserDeleted === 'true') {
      query.andWhere('user.deletedAt IS NOT NULL');
    }

    if (isUserDeleted === 'false') {
      query.andWhere('user.deletedAt IS NULL');
    }

    if (search) {
      query.andWhere(
        '(LOWER(user.firstName) LIKE LOWER(:search) or LOWER(user.lastName) LIKE LOWER(:search) or LOWER(user.phoneNumber) LIKE LOWER(:search) )',
        { search: `%${search}%` },
      );
    }
    const [quotations, total] = await query
      .take(take)
      .skip(skip)
      .getManyAndCount();
    const lastPage = Math.ceil(total / take);
    if (total === 0) {
      throw new NotFoundException('No quotations available.');
    }
    if (lastPage < page) {
      throw new InternalServerErrorException('Requested page does not exists.');
    }
    try {
      return {
        quotations,
        meta: {
          total,
          page,
          lastPage,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch quotations data from system',
      );
    }
  }

  async findQuoteById(id: number) {
    const query = this.createQueryBuilder('quotation').withDeleted();
    query
      .select([
        'quotation.id',
        'quotation.status',
        'quotation.price',
        'quotation.createdAt',
        'quotation.count',
        'quotation.notes',
        'quotation.validity',
        'customer.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.phoneNumber',
        'user.deletedAt',
        'customerCategory.name',
      ])
      .leftJoin('quotation.customer', 'customer')
      .leftJoinAndSelect('quotation.quotationServices', 'quotationServices')
      .leftJoinAndSelect('quotationServices.service', 'service')
      .leftJoin('customer.customerCategory', 'customerCategory')
      .leftJoin('customer.user', 'user')
      .loadRelationCountAndMap(
        'customer.quotationsCount',
        'customer.quotations',
      )
      .leftJoinAndSelect('quotation.userQuotes', 'userQuotes')
      .where('quotation.id = :id', { id });
    const quotation = await query.getOne();
    return quotation;
  }

  async getCountOfQuotations(getOverviewDto: GetOverviewDto) {
    const query = this.createQueryBuilder('quotation');
    const start = new Date(getOverviewDto.startDate);
    const end = new Date(getOverviewDto.endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(24, 0, 0, 0);

    const receivedQuotations = await query
      .where('quotation.createdAt >= :start', { start })
      .andWhere('quotation.createdAt <= :end', { end })
      .getCount();
    const status = 'PENDING';
    const pendingQuotations = await query
      .andWhere('quotation.status = :status', { status })
      .getCount();

    return [receivedQuotations, pendingQuotations];
  }

  expiredDate(updateDate: Date, days: number) {
    updateDate.setHours(23, 59, 59, 999);
    updateDate.setDate(updateDate.getDate() + days);
    return updateDate;
  }

  async checkForValidity() {
    const query = this.createQueryBuilder('quotation');
    const status = 'WAITING';
    const waitingQuotations = await query
      .where('quotation.status = :status', { status })
      .getMany();
    waitingQuotations.map((quotation) => {
      const expiredDate = this.expiredDate(
        quotation.updatedAt,
        quotation.validity,
      );
      if (expiredDate < new Date()) {
        quotation.status = Status.FOLLOWUP;
        this.save(quotation);
      }
    });
  }
}
