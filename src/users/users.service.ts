import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import LocalFilesService from 'src/local-files/local-files.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private localFilesService: LocalFilesService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.create({ ...createUserDto });
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that phone number already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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

  async deleteUser(id: string): Promise<{ success: boolean }> {
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
  async addAvatar(userId: string, fileData: LocalFileDto) {
    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.usersRepository.update(userId, {
      avatarId: avatar.id,
    });
  }
}
