import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto';
import { Role } from './entities/role.enum';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      email,
      password: hashedPassword,
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async createAdmin(createUserDto: CreateUserDto): Promise<void> {
    const { username, email, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      username,
      email,
      password: hashedPassword,
      roles: Role.ADMIN,
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const query = this.createQueryBuilder('user');
    const users = await query
      .where('user.roles IN (:...roles)', {
        roles: ['admin', 'manager', 'user'],
      })
      .getMany();
    return users;
  }

  async deleteUser(id: string): Promise<void> {
    const query = this.createQueryBuilder('user');
    const deleteUser = await query
      .softDelete()
      .where('id= :id', { id })
      .execute();
  }
}
