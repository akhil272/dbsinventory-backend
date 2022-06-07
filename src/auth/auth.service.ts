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

  async generateOtp(generateOtpDto: GenerateOtpDto) {
    const { phone_number } = generateOtpDto;
    const user = await this.usersRepository.getUserByPhoneNumber(phone_number);
    if (!user.is_verified) {
      throw new ForbiddenException('User not verified');
    }
    try {
      const token = otplib.authenticator.generate(
        `${user.phone_number}${this.configService.get('SMS_SECRET')}`,
      );
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

  async validateOtp(verifyOtpDto: ValidateOtpDto): Promise<{
    success: boolean;
    data: {
      accessToken: string;
      refreshToken: string;
      user: {
        id: number;
        phone_number: string;
        email: string;
        first_name: string;
        last_name: string | undefined;
        roles: string;
      };
    };
  } | void> {
    const { phone_number, otp } = verifyOtpDto;
    const user = await this.usersRepository.getUserByPhoneNumber(phone_number);

    const isOtpValid = this.verifyOtp(otp, user);

    if (isOtpValid) {
      this.logger.debug(`OTP for user ${user?.phone_number} is valid`);
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
            phone_number: user.phone_number,
            email: user.email,
            roles: user.roles,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        },
      };
    } else {
      throw new HttpException('Failed to verify user', HttpStatus.BAD_REQUEST);
    }
  }

  verifyOtp(token: string, user: User): boolean {
    try {
      const verified = otplib.authenticator.verify({
        token,
        secret: `${user.phone_number}${this.configService.get('SMS_SECRET')}`,
      });
      return verified;
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

  async generateAccessToken(user: User): Promise<string> {
    const { id, phone_number } = user;
    const options: JwtSignOptions = {
      ...BASE_OPTIONS,
      subject: `${id}`,
    };
    const payload: JwtPayload = { phone_number };
    const accessToken = this.jwtService.sign(payload, options);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return accessToken;
  }

  async generateRefreshToken(user: User, expiresIn: number): Promise<string> {
    const { id, phone_number } = user;
    const token = await this.refreshTokenRepository.createRefreshToken(
      user,
      expiresIn,
    );
    this.logger.debug(
      `Generated refresh token for user ${phone_number}, token: ${token}`,
    );
    const optionss: JwtSignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: `${id}`,
      jwtid: `${token.id}`,
    };

    const payload: JwtPayload = { phone_number };
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

  getCookieWithJwtAccessToken(phone_number: string) {
    const payload: TokenPayload = { phone_number };
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

  getCookieWithJwtRefreshToken(phone_number: string) {
    const payload: TokenPayload = { phone_number };
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
    if (findUser.is_email_verified) {
      throw new ConflictException('Email already verified.');
    }
    return await this.mailService.sendUserConfirmation(user);
  }
}
