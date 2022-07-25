import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  GetUsersFilterDto,
  UsersWithMetaDto,
} from './dto/get-users-filter.dto';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { GetCsvFileDto } from './dto/get-csv-file.dto';
import { Role } from './entities/role.enum';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    try {
      const user = this.create({
        ...registerUserDto,
      });
      await this.save(user);
      return user;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that phone number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    const user = await this.findOne({ phoneNumber });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this phone number does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<UsersWithMetaDto> {
    const { search, role, take = 25, page = 1 } = filterDto;
    const query = this.createQueryBuilder('user');
    const skip = (page - 1) * take;
    const count = await query.getCount();
    if (count <= 0) {
      throw new NotFoundException('No users available.');
    }
    if (role) {
      query.where('user.role IN (:...role)', {
        role: [role],
      });
    }
    if (search) {
      query.where(
        '(LOWER(user.firstName) LIKE LOWER(:search) or LOWER(user.lastName) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    query.orderBy('user.createdAt', 'DESC');
    const [users, total] = await query.take(take).skip(skip).getManyAndCount();
    if (total === 0) {
      throw new NotFoundException('No users available.');
    }
    const lastPage = Math.ceil(total / take);
    if (lastPage < page) {
      throw new InternalServerErrorException('Requested page does not exists.');
    }
    try {
      return {
        users,
        meta: {
          total,
          page,
          lastPage,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch users data from system',
      );
    }
  }

  async deleteUser(id: number): Promise<{ success: boolean }> {
    const query = this.createQueryBuilder('user');
    try {
      await query.softDelete().where('id= :id', { id }).execute();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async getOverView(userId: number) {
    const query = this.createQueryBuilder('user');
    query
      .where('user.id =:id', { id: userId })
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.phoneNumber',
        'user.email',
        'user.role',
      ])
      .leftJoinAndSelect('user.customer', 'customer');
    const quotationAndOrders = await query
      .leftJoinAndSelect('customer.orders', 'orders')
      .leftJoinAndSelect('customer.quotations', 'quotations')
      .getOne();

    return {
      quotationAndOrders,
    };
  }

  async getCSVData(getCsvFileDto: GetCsvFileDto) {
    const query = this.createQueryBuilder('user');
    const start = new Date(getCsvFileDto.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(getCsvFileDto.endDate);
    end.setHours(24, 0, 0, 0);
    try {
      const users = await query
        .where('user.createdAt >= :start', { start })
        .andWhere('user.createdAt <= :end', { end })
        .loadAllRelationIds()
        .getMany();
      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
