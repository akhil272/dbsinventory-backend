import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { SmsModule } from 'src/sms/sms.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [MailModule, SmsModule, ConfigModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
