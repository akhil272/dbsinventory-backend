import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.enum';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  createAdmin(createUserDto: CreateUserDto): Promise<void> {
    return this.usersRepository.createAdmin(createUserDto);
  }

  getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    return this.usersRepository.getUsers(filterDto);
  }

  async getUserById(id: string): Promise<User> {
    const found = await this.usersRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return found;
  }

  async updateUserRoleById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { roles } = updateUserDto;
    const user = await this.getUserById(id);
    user.roles = roles;
    await this.usersRepository.save(user);
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    user.roles = Role.DELETED;
    user.password = user.password.concat('deleted');
    await this.usersRepository.save(user);
  }
}
