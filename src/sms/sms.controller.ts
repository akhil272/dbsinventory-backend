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
    if (request.user.is_verified) {
      throw new BadRequestException('Phone number already confirmed');
    }

    await this.smsService.verifyPhoneNumber(request.user.phone_number);
    return { success: true };
  }

  @Post('check-verification-code')
  @UseGuards(JwtAuthenticationGuard)
  async checkVerificationCode(
    @Req() request: RequestWithUser,
    @Body() verificationData: CheckVerificationCodeDto,
  ): Promise<{ success: boolean }> {
    const { verification_code } = verificationData;
    const userVerificationCompleted = await this.smsService.confirmPhoneNumber(
      request.user.phone_number,
      verification_code,
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
    await this.smsService.verifyPhoneNumber(retryInitiateDto.phone_number);
    return { success: true };
  }

  @Post('retry-verification')
  async retryVerification(
    @Body() retryVerificationDto: RetryVerificationDto,
  ): Promise<{ success: boolean }> {
    console.log(retryVerificationDto);

    const userVerificationCompleted = await this.smsService.confirmPhoneNumber(
      retryVerificationDto.phone_number,
      retryVerificationDto.otp,
    );
    if (!userVerificationCompleted) {
      return { success: false };
    }
    return { success: true };
  }
}
