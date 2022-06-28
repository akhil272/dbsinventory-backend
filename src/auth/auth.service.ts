import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersRepository } from '../users/users.repository';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { TokenExpiredError } from 'jsonwebtoken';

import ValidateOtpDto from './dto/validate-otp.dto';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BASE_OPTIONS } from './jwt-base-options';
import { RefreshTokenRepository } from './refresh-token.repository';
import { TokenPayload } from './token-payload.interface';
import { JwtPayload } from './jwt-payload.interface';
import SmsService from 'src/sms/sms.service';
import otplib from 'src/config/otplib.config';
import { RefreshTokenPayload } from './refresh-token-payload.interface';
import { RefreshToken } from './entities/refresh-token.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(RefreshTokenRepository)
    private refreshTokenRepository: RefreshTokenRepository,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    return this.usersRepository.createUser(registerUserDto);
  }

  async generateOtpForNewUser(user: User) {
    try {
      const token = otplib.authenticator.generate(
        `${user.phoneNumber}${this.configService.get('SMS_SECRET')}`,
      );
      this.smsService.sendSms({
        phoneNumbers: [user.phoneNumber],
        body: `${token} is your DBS Tyres App secret OTP to login.`,
      });
      return {
        success: true,
      };
    } catch (error) {
      const errorMessage = `Failed to generate OTP for user ${user.firstName} ${user.phoneNumber}`;
      this.logger.error(errorMessage, error.stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async generateOtp(generateOtpDto: GenerateOtpDto) {
    const { phoneNumber } = generateOtpDto;
    const user = await this.usersRepository.getUserByPhoneNumber(phoneNumber);
    if (!user.isPhoneNumberVerified) {
      throw new ForbiddenException('User not verified');
    }
    try {
      const token = otplib.authenticator.generate(
        `${user.phoneNumber}${this.configService.get('SMS_SECRET')}`,
      );
      this.smsService.sendSms({
        phoneNumbers: [user.phoneNumber],
        body: `${token} is your DBS Tyres App secret OTP to login`,
      });
      return {
        success: true,
      };
    } catch (error) {
      const errorMessage = `Failed to generate OTP for user ${user.firstName}`;
      this.logger.error(errorMessage, error.stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async validateOtpAndVerifyPhoneNumber(verifyOtpDto: ValidateOtpDto): Promise<{
    success: boolean;
    data: {
      accessToken: string;
      refreshToken: string;
      user: {
        id: number;
        phoneNumber: string;
        email: string;
        firstName: string;
        lastName: string | undefined;
        role: string;
      };
    };
  } | void> {
    const { phoneNumber, otp } = verifyOtpDto;
    const user = await this.usersRepository.getUserByPhoneNumber(phoneNumber);

    const isOtpValid = this.verifyOtp(otp, user);

    if (isOtpValid) {
      this.logger.log(`OTP for user ${user?.phoneNumber} is valid`);
      user.isPhoneNumberVerified = true;
      await this.usersRepository.save(user);
      this.logger.log(`User phone number ${user?.phoneNumber} is verified`);
      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(
        user,
        60 * 60 * 24 * 30,
      );
      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      };
    } else {
      throw new HttpException('Failed to verify user', HttpStatus.BAD_REQUEST);
    }
  }

  async loginWithOtp(verifyOtpDto: ValidateOtpDto): Promise<{
    success: boolean;
    data: {
      accessToken: string;
      refreshToken: string;
      user: {
        id: number;
        phoneNumber: string;
        email: string;
        firstName: string;
        lastName: string | undefined;
        role: string;
      };
    };
  } | void> {
    const { phoneNumber, otp } = verifyOtpDto;
    const user = await this.usersRepository.getUserByPhoneNumber(phoneNumber);
    const isOtpValid = this.verifyOtp(otp, user);
    if (isOtpValid) {
      this.logger.log(`OTP for user ${user?.phoneNumber} is valid`);
      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(
        user,
        60 * 60 * 24 * 30,
      );
      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      };
    } else {
      throw new HttpException('Failed to login user', HttpStatus.BAD_REQUEST);
    }
  }

  verifyOtp(token: string, user: User): boolean {
    try {
      const verified = otplib.authenticator.verify({
        token,
        secret: `${user.phoneNumber}${this.configService.get('SMS_SECRET')}`,
      });
      return verified;
    } catch (error) {
      const errorMessage = `Failed to generate OTP for user ${user.firstName}`;
      this.logger.error(errorMessage, error.stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getAuthenticatedUser(phoneNumber: string): Promise<User> {
    try {
      const user = await this.usersRepository.getUserByPhoneNumber(phoneNumber);
      // await this.smsService.verifyPhoneNumber(phone_number);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async generateAccessToken(user: User): Promise<string> {
    const { id, phoneNumber } = user;
    const options: JwtSignOptions = {
      ...BASE_OPTIONS,
      subject: `${id}`,
    };
    const payload: JwtPayload = { phoneNumber };
    const accessToken = this.jwtService.sign(payload, options);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return accessToken;
  }

  async generateRefreshToken(user: User, expiresIn: number): Promise<string> {
    const { id, phoneNumber } = user;
    const token = await this.refreshTokenRepository.createRefreshToken(
      user,
      expiresIn,
    );

    const optionss: JwtSignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: `${id}`,
      jwtid: `${token.id}`,
    };

    const payload: JwtPayload = { phoneNumber };
    return this.jwtService.sign(payload, optionss);
  }

  async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: User; token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);
    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return { user, token };
  }

  async createAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { user } = await this.resolveRefreshToken(refreshToken);

    const accessToken = await this.generateAccessToken(user);

    return { accessToken, refreshToken };
  }

  async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<User> {
    const userId = payload.sub;

    if (!userId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.usersService.getUserById(userId);
  }

  async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | undefined> {
    const tokenId = payload.jti;
    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.refreshTokenRepository.findTokenById(tokenId);
  }

  async sendMailConfirmationLink(user) {
    const findUser = await this.usersService.getUserByMail(user.email);
    if (findUser.isEmailVerified) {
      throw new ConflictException('Email already verified.');
    }
    return await this.mailService.sendUserConfirmation(user);
  }
}
