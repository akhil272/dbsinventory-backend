import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

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

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const query = this.createQueryBuilder('user');
    const users = await query
      .where('user.role IN (:...roles)', {
        roles: ['admin', 'manager', 'user', 'employee'],
      })
      .getMany();
    return users;
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
}
