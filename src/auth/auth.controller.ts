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
import { UsersService } from 'src/users/users.service';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import ValidateOtpDto from './dto/validate-otp.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<{
    success: boolean;
    data: {
      accessToken: string;
    };
  } | void> {
    const user = await this.authService.register(registerUserDto);
    const accessToken = await this.authService.generateAccessToken(user);
    return {
      success: true,
      data: { accessToken },
    };
  }

  @HttpCode(200)
  @Post('otp/generate')
  generateOtp(
    @Body() generateOtpDto: GenerateOtpDto,
  ): Promise<{ success: boolean } | void> {
    return this.authService.generateOtp(generateOtpDto);
  }

  @HttpCode(200)
  @Post('otp/validate')
  async validateOtp(
    @Body() validateOtpDto: ValidateOtpDto,
  ): Promise<{ success: boolean; data: { accessToken; refreshToken } | void }> {
    const user = await this.usersService.getUserByPhoneNumber(
      validateOtpDto.phone_number,
    );
    const otpValidated = await this.authService.validateOtp(validateOtpDto);
    if (otpValidated) {
      const accessToken = await this.authService.generateAccessToken(user);
      const refreshToken = await this.authService.generateRefreshToken(
        user,
        60 * 60 * 24 * 30,
      );

      await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

      return {
        success: true,
        data: { accessToken, refreshToken },
      };
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

  @Get('refresh')
  async refresh(
    @Req() request: RequestWithUser,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.createAccessTokenFromRefreshToken(
      refreshTokenDto.refreshToken,
    );
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
