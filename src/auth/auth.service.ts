import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import SmsService from 'src/sms/sms.service';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { authenticator } from 'otplib';
import ValidateOtpDto from './dto/validate-otp.dto';
import { UsersService } from 'src/users/users.service';
const secret = 'helloworld';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly smsService: SmsService,
    private readonly usersService: UsersService,
  ) {}

  async register(signUpCredentialsDto: SignUpCredentialsDto): Promise<User> {
    return this.usersRepository.createUser(signUpCredentialsDto);
  }

  async generateOtp(generateOtpDto: GenerateOtpDto) {
    const { phone_number } = generateOtpDto;
    const user = await this.usersRepository.getUserByPhoneNumber(phone_number);
    if (!user.is_verified) {
      throw new ForbiddenException('User not verified');
    }
    try {
      const token = authenticator.generate(`${user.phone_number}${secret}`);
      this.smsService.sendSms({
        phoneNumbers: [user.phone_number],
        body: `${token} is your DBS Stock App secret OTP to login`,
      });
      return {
        success: true,
      };
    } catch (error) {
      const errorMessage = `Failed to generate OTP for user ${user.first_name}`;
      this.logger.error(errorMessage, error.stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async validateOtp(verifyOtpDto: ValidateOtpDto) {
    const { phone_number, otp } = verifyOtpDto;
    const user = await this.usersRepository.getUserByPhoneNumber(phone_number);
    const isOtpValid = this.verifyOtp(otp, user);
    if (isOtpValid) {
      return true;
    }
    throw new HttpException('Failed to verify user', HttpStatus.BAD_REQUEST);
  }

  verifyOtp(token: string, user: User): boolean {
    try {
      return authenticator.verify({
        token,
        secret: `${user.phone_number}${secret}`,
      });
    } catch (error) {
      const errorMessage = `Failed to generate OTP for user ${user.first_name}`;
      this.logger.error(errorMessage, error.stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getAuthenticatedUser(phone_number: string): Promise<User> {
    try {
      const user = await this.usersRepository.getUserByPhoneNumber(
        phone_number,
      );
      // await this.smsService.verifyPhoneNumber(phone_number);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getCookieWithJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return { cookie, token };
  }

  getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
