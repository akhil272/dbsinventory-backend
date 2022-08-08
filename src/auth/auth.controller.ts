import {
  Body,
  Controller,
  Get,
  HttpCode,
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
    // await this.authService.generateOtpForNewUser(user);
    return {
      success: true,
      data: { accessToken },
    };
  }

  @HttpCode(200)
  @Post('otp/validate')
  async validateOtpAndVerifyPhoneNumber(
    @Body() validateOtpDto: ValidateOtpDto,
  ): Promise<{
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
    return this.authService.validateOtpAndVerifyPhoneNumber(validateOtpDto);
  }

  @HttpCode(200)
  @Post('otp/generate')
  generateOtp(
    @Body() generateOtpDto: GenerateOtpDto,
  ): Promise<{ success: boolean } | void> {
    return this.authService.generateOtp(generateOtpDto);
  }

  @HttpCode(200)
  @Post('otp/login')
  async loginWithOtp(@Body() validateOtpDto: ValidateOtpDto): Promise<{
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
    return this.authService.loginWithOtp(validateOtpDto);
  }

  @Post('/refresh')
  @HttpCode(201)
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
    return { success: true };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('mail-confirmation-link')
  sendMailConfirmationLink(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.authService.sendMailConfirmationLink(user);
  }
}
