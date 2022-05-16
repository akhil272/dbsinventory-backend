import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import RequestWithUser from './request-with-user.interface';
import SmsService from 'src/sms/sms.service';
import { User } from 'src/users/entities/user.entity';
import JwtRefreshGuard from './jwt-refresh.guard';
import { UsersService } from 'src/users/users.service';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import ValidateOtpDto from './dto/validate-otp.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly smsService: SmsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Req() request: RequestWithUser,
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<User> {
    const user = await this.authService.register(registerUserDto);
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    request.res.setHeader('Set-Cookie', [accessTokenCookie]);
    return user;
  }

  @HttpCode(200)
  @Post('otp/generate')
  generateOtp(@Body() generateOtp: GenerateOtpDto) {
    return this.authService.generateOtp(generateOtp);
  }

  @HttpCode(200)
  @Post('otp/validate')
  async validateOtp(
    @Req() request: RequestWithUser,
    @Body() validateOtpDto: ValidateOtpDto,
  ) {
    const user = await this.usersService.getUserByPhoneNumber(
      validateOtpDto.phone_number,
    );

    const otpValidated = await this.authService.validateOtp(validateOtpDto);

    if (otpValidated) {
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
        user.id,
      );
      const { cookie: refreshTokenCookie, token: refreshToken } =
        this.authService.getCookieWithJwtRefreshToken(user.id);
      await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

      request.res.setHeader('Set-Cookie', [
        accessTokenCookie,
        refreshTokenCookie,
      ]);
      return user;
    }
    throw new HttpException('Failed to verify user', HttpStatus.BAD_REQUEST);
  }

  @HttpCode(200)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return { success: true };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
