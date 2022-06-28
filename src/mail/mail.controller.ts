import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import ConfirmEmailDto from './dto/confirm-email.dto';
import { MailService } from './mail.service';

@Controller('mail')
@UseGuards(JwtAuthenticationGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.mailService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.mailService.confirmEmail(email);
  }
}
