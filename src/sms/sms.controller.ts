import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckVerificationCodeDto } from 'src/auth/dto/check-verification-code.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import RequestWithUser from 'src/auth/request-with-user.interface';
import { RetryInitiateDto } from './dto/retry-initiate.dto';
import { RetryVerificationDto } from './dto/retry-verification.dto';
import SmsService from './sms.service';

@Controller('sms')
@UseInterceptors(ClassSerializerInterceptor)
export default class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('initiate-verification')
  @UseGuards(JwtAuthenticationGuard)
  async initiatePhoneNumberVerification(
    @Req() request: RequestWithUser,
  ): Promise<{ success: boolean }> {
    if (request.user.isPhoneNumberVerified) {
      throw new BadRequestException('Phone number already confirmed');
    }

    await this.smsService.verifyPhoneNumber(request.user.phoneNumber);
    return { success: true };
  }

  @Post('check-verification-code')
  @UseGuards(JwtAuthenticationGuard)
  async checkVerificationCode(
    @Req() request: RequestWithUser,
    @Body() verificationData: CheckVerificationCodeDto,
  ): Promise<{ success: boolean }> {
    const { verificationCode } = verificationData;
    const userVerificationCompleted = await this.smsService.confirmPhoneNumber(
      request.user.phoneNumber,
      verificationCode,
    );
    if (!userVerificationCompleted) {
      return { success: false };
    }
    return { success: true };
  }

  @Post('retry-initiate')
  async retryInitiateVerification(
    @Body() retryInitiateDto: RetryInitiateDto,
  ): Promise<{ success: boolean }> {
    await this.smsService.verifyPhoneNumber(retryInitiateDto.phoneNumber);
    return { success: true };
  }

  @Post('retry-verification')
  async retryVerification(
    @Body() retryVerificationDto: RetryVerificationDto,
  ): Promise<{ success: boolean }> {
    const userVerificationCompleted = await this.smsService.confirmPhoneNumber(
      retryVerificationDto.phoneNumber,
      retryVerificationDto.otp,
    );
    if (!userVerificationCompleted) {
      return { success: false };
    }
    return { success: true };
  }
}
