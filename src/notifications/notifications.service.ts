import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(private readonly mailService: MailService) {}

  saleOfStock(user: User, order: Order) {
    this.mailService.sendInvoiceToUserByMail(user, order);
  }
}
