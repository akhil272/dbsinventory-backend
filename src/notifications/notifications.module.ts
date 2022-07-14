import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [MailModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
