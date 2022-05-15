import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  getUserByPhoneNumber(phone_number: string): Promise<User> {
    return this.usersRepository.getUserByPhoneNumber(phone_number);
  }

  getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    return this.usersRepository.getUsers(filterDto);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      current_hashed_refresh_token: currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.current_hashed_refresh_token,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: string) {
    return await this.usersRepository.update(userId, {
      current_hashed_refresh_token: null,
    });
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
    return this.usersRepository.deleteUser(id);
  }

  markPhoneNumberAsConfirmed(userId: string) {
    return this.usersRepository.update(
      { id: userId },
      {
        is_verified: true,
      },
    );
  }
}
