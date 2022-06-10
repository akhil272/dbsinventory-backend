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
    const { take = 25, page = 1, status, sortBy, search } = filterDto;
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
        'quotation.created_at',
        'quotation.count',
        'quotation.notes',
        'user.first_name',
        'user.last_name',
      ])
      .leftJoin('quotation.user', 'user');
    if (status) {
      query.andWhere('quotation.status = :status', { status });
    }
    if (sortBy) {
      if (sortBy === 'ASC') {
        query.orderBy('quotation.created_at', 'ASC');
      }
      if (sortBy === 'DESC') {
        query.orderBy('quotation.created_at', 'DESC');
      }
    }
    if (search) {
      query.andWhere(
        '(LOWER(user.first_name) LIKE LOWER(:search) or LOWER(user.last_name) LIKE LOWER(:search) )',
        { search: `%${search}%` },
      );
    }
    const [quotations, total] = await query
      .take(take)
      .skip(skip)
      .getManyAndCount();
    const last_page = Math.ceil(total / take);
    if (last_page < page) {
      throw new InternalServerErrorException('Requested page does not exists.');
    }
    try {
      return {
        quotations,
        meta: {
          total,
          page,
          last_page,
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
        'quotation.created_at',
        'quotation.count',
        'quotation.notes',
        'quotation.validity',
        'user.first_name',
        'user.last_name',
      ])
      .leftJoin('quotation.user', 'user')
      .leftJoinAndSelect('quotation.userQuotes', 'userQuotes')
      .where('quotation.id = :id', { id });
    const quotation = await query.getOne();
    return quotation;
  }
}
