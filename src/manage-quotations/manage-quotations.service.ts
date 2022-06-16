import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import RequestWithUser from 'src/auth/request-with-user.interface';
import { MailService } from 'src/mail/mail.service';
import { PDFService } from 'src/pdf/pdf.service';
import { Status } from 'src/quotations/entities/status.enum';
import { QuotationsService } from 'src/quotations/quotations.service';
import SmsService from 'src/sms/sms.service';
import { UpdateUserQuoteDto } from 'src/user-quote/dto/update-user-quote.dto';
import { UserQuoteService } from 'src/user-quote/user-quote.service';
import { UsersService } from 'src/users/users.service';
import { SendQuotationDto } from './dto/send-quotation.dto';

@Injectable()
export class ManageQuotationsService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly userQuoteService: UserQuoteService,
    private readonly quotationsService: QuotationsService,
    private readonly pdfService: PDFService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
  ) {}

  async updateQuotationPriceWithUserQuote(
    id: number,
    updateUserQuoteDto: UpdateUserQuoteDto,
  ) {
    const userQuoteWithPrice = await this.userQuoteService.update(
      id,
      updateUserQuoteDto,
    );

    const quotation = await this.quotationsService.updateTotalPrice(
      userQuoteWithPrice.price,
      userQuoteWithPrice.userQuote.quotation.id,
    );
    return quotation;
  }

  async getPDF(id: number, request: RequestWithUser) {
    const quotation = await this.quotationsService.findOne(id);
    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }
    const user = await this.usersService.getUserById(quotation.customer.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.id !== request.user.id) {
      throw new ForbiddenException('You can not download others quotation');
    }

    const pdf = await this.pdfService.generatePDFWithQuotationAndUser(
      user,
      quotation,
    );
    return pdf;
  }
  async sendQuotation(sendQuotationDto: SendQuotationDto) {
    const { quotationId, sms, whatsApp, email, callback } = sendQuotationDto;
    const quotation = await this.quotationsService.findOne(quotationId);
    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }
    const user = await this.usersService.getUserByPhoneNumber(
      quotation.customer.user.phoneNumber,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (sms) {
      this.logger.log(`Sending SMS to ${user.phoneNumber}`);
      const message = `Hi ${user.firstName}, your quotation is ready. Please check your email for more details.`;
      await this.smsService.sendQuotationMessage(user.phoneNumber, message);
    }
    if (whatsApp) {
      this.logger.log(`Sending WhatsApp to ${user.phoneNumber}`);
    }
    if (email) {
      this.logger.log(`Sending Email to ${user.email}`);
      await this.mailService.sendQuotationToUserByMail(user, quotation);
    }
    if (callback) {
      this.logger.log(`Sending Callback to ${user.phoneNumber}`);
    }
    quotation.status = Status.WAITING;
    await this.quotationsService.updateQuotationStatus(quotation);
    return quotation;
  }
}
