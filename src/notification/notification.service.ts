import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { Order } from 'src/orders/entities/order.entity';
import { Quotation } from 'src/quotations/entities/quotation.entity';
import SmsService from 'src/sms/sms.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
  ) {}

  saleOfStock(user: User, order: Order) {
    this.mailService.sendInvoiceToUserByMail(user, order);
  }

  quotationDeclinedByUser(user: User, quotation: Quotation) {
    const url = `${this.configService.get(
      'BASE_URL',
    )}/quotations/view?quotationId=${quotation.id}&status=DECLINED`;
    const message = `User: ${user.firstName}, ${user.phoneNumber} has declined the quotation. View quotation details ${url}`;
    // this.smsService.sendMessage(user.phoneNumber, message);
    this.logger.log(message);
  }
}
