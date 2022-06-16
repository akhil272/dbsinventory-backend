import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetQuotationsFilterDto } from './dto/get-quotations-filter.dto';
import { QuotationsResponseDto } from './dto/quotation-response.dto';
import { Quotation } from './entities/quotation.entity';

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
    } = filterDto;
    const query = this.createQueryBuilder('quotation');
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
        'customerCategory.name',
      ])
      .leftJoin('quotation.customer', 'customer')
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
    const query = this.createQueryBuilder('quotation');
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
        'customerCategory.name',
      ])
      .leftJoin('quotation.customer', 'customer')
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
}
