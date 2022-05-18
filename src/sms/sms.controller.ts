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
import SmsService from './sms.service';

@Controller('sms')
@UseGuards(JwtAuthenticationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export default class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('initiate-verification')
  async initiatePhoneNumberVerification(@Req() request: RequestWithUser) {
    if (request.user.is_verified) {
      throw new BadRequestException('Phone number already confirmed');
    }

    await this.smsService.verifyPhoneNumber(request.user.phone_number);
  }

  @Post('check-verification-code')
  @UseGuards(JwtAuthenticationGuard)
  async checkVerificationCode(
    @Req() request: RequestWithUser,
    @Body() verificationData: CheckVerificationCodeDto,
  ): Promise<{ success: boolean }> {
    if (request.user.is_verified) {
      throw new BadRequestException('Phone number already confirmed');
    }
    const userVerificationCompleted = await this.smsService.confirmPhoneNumber(
      request.user.id,
      request.user.phone_number,
      verificationData.verification_code,
    );
    if (!userVerificationCompleted) {
      return { success: false };
    }
    return { success: true };
  }
}
