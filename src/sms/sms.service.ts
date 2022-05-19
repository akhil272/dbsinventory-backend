import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import validE164 from 'src/utils/helpers/validateE164';
import { Twilio } from 'twilio';
import { sendSmsPayload } from './types';

@Injectable()
export default class SmsService {
  private readonly logger = new Logger(this.constructor.name);
  private twilioClient: Twilio;
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
  }
  verifyPhoneNumber(phone_number: string) {
    const serviceSid = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    return this.twilioClient.verify
      .services(serviceSid)
      .verifications.create({ to: phone_number, channel: 'sms' });
  }

  async confirmPhoneNumber(
    userId: number,
    phoneNumber: string,
    verificationCode: string,
  ) {
    const serviceSid = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    const result = await this.twilioClient.verify
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: verificationCode });

    if (!result.valid || result.status !== 'approved') {
      throw new BadRequestException('Wrong code provided');
    }

    await this.usersService.markPhoneNumberAsConfirmed(userId);
    return { success: true };
  }

  async sendMessage(receiverPhoneNumber: string, message: string) {
    const senderPhoneNumber = this.configService.get(
      'TWILIO_SENDER_PHONE_NUMBER',
    );

    return this.twilioClient.messages.create({
      body: message,
      from: senderPhoneNumber,
      to: receiverPhoneNumber,
    });
  }

  sendSms({ phoneNumbers, body }: sendSmsPayload) {
    const senderPhoneNumber = this.configService.get(
      'TWILIO_SENDER_PHONE_NUMBER',
    );
    phoneNumbers.map((phoneNumber) => {
      if (!validE164(phoneNumber)) {
        throw new Error('Phone Number must be in the E164 format!');
      }

      const textContent = {
        body,
        to: phoneNumber,
        from: senderPhoneNumber,
      };

      this.logger.log(`Sending OTP to '${phoneNumber}'`);
      this.twilioClient.messages
        .create(textContent)
        .then((message) => {
          this.logger.log(`Sent OTP to '${message.to}'`);
        })
        .catch((error) => {
          this.logger.log(
            `Error while sending OTP to '${phoneNumber}'`,
            error.stack,
          );
          throw new InternalServerErrorException(
            `Error while sending OTP to '${phoneNumber}'`,
          );
        });
    });
  }
}
