import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import LocalFilesService from 'src/local-files/local-files.service';
import { ApiResponse } from 'src/utils/types/common';
import { Role } from './entities/role.enum';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private localFilesService: LocalFilesService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.usersRepository.create({ ...createUserDto });
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

  async createNewUserFromQuotation(
    createUserDto: RegisterUserDto,
  ): Promise<User> {
    try {
      const user = this.usersRepository.create({ ...createUserDto });
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

  getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.usersRepository.getUserByPhoneNumber(phoneNumber);
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<ApiResponse<User[]>> {
    const users = await this.usersRepository.getUsers(filterDto);
    return {
      success: true,
      data: users,
    };
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this phone number does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    phoneNumber: string,
  ) {
    const user = await this.getUserByPhoneNumber(phoneNumber);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return await this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async updateUserRoleById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { role } = updateUserDto;
    const user = await this.getUserById(+id);
    user.role = role;
    await this.usersRepository.save(user);
    return user;
  }

  async updateUserProfile(
    id: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    await this.usersRepository.update(id, updateUserProfileDto);
    const user = await this.getUserById(id);
    const { phoneNumber, email } = updateUserProfileDto;
    if (phoneNumber !== user.phoneNumber) {
      user.isPhoneNumberVerified = false;
      await this.usersRepository.save(user);
    }
    if (email !== user.email) {
      user.isEmailVerified = false;
      await this.usersRepository.save(user);
    }
    return user;
  }

  async deleteUser(id: number): Promise<{ success: boolean }> {
    return this.usersRepository.deleteUser(id);
  }

  markPhoneNumberAsConfirmed(userId: number) {
    return this.usersRepository.update(
      { id: userId },
      {
        isPhoneNumberVerified: true,
      },
    );
  }
  async addAvatar(userId: number, fileData: LocalFileDto) {
    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.usersRepository.update(userId, {
      avatarId: avatar.id,
    });
  }

  async getFilePath(avatarId: number) {
    const filePath = await this.localFilesService.getFileById(avatarId);
    return filePath;
  }

  async getUserByMail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        'Provided email not registered in the system.',
      );
    }
    return user;
  }

  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update(
      { email },
      {
        isEmailVerified: true,
      },
    );
  }

  async createNewUser(
    firstName: string,
    lastName: string,
    phoneNumber: string,
  ) {
    const user = await this.usersRepository.create({
      firstName,
      lastName,
      phoneNumber,
      role: Role.USER,
    });
    await this.usersRepository.save(user);
    return user;
  }

  async create(user: RegisterUserDto): Promise<User> {
    const newUser = this.usersRepository.create({ ...user });
    return this.usersRepository.save(newUser);
  }

  async findOrCreateUser(user: RegisterUserDto, userId: number): Promise<User> {
    if (userId) {
      return await this.usersRepository.findOne(userId);
    }
    if (user) {
      const findUserByPhoneNumber = await this.usersRepository.findOne({
        where: { phoneNumber: user.phoneNumber },
      });

      if (!findUserByPhoneNumber) {
        return await this.create(user);
      }
      return findUserByPhoneNumber;
    }
  }

  getOverView(userId: number) {
    return this.usersRepository.getOverView(userId);
  }
}
