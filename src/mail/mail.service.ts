import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Order } from 'src/orders/entities/order.entity';
import { Quotation } from 'src/quotations/entities/quotation.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import VerificationTokenPayload from './verificationTokenPayload.interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly jwtService: JwtService,
    private mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}
  platformUrl = this.configService.get('PLATFORM_URL');
  supportPhoneNumber = this.configService.get('SUPPORT_PHONE');
  logo = this.configService.get('LOGO');

  async sendUserConfirmation(user: User) {
    const email = user.email;
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to DBS Tyres! Confirm your Email',
      template: 'confirmMail', // `.hbs` extension is appended automatically
      context: {
        name: user.firstName,
        url,
        support_url: this.supportPhoneNumber,
      },
    });
  }

  async confirmEmail(email: string) {
    const user = await this.usersService.getUserByMail(email);
    if (user.isEmailVerified) {
      throw new ConflictException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
    this.welcomeMail(user);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async sendQuotationToUserByMail(user: User, quotation: Quotation) {
    const url = `${this.configService.get('QUOTATION_URL')}?quotationId=${
      quotation.id
    }`;
    try {
      await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Your Quotation is ready | DBS Tyres',
        template: 'quotation', // `.hbs` extension is appended automatically
        context: {
          name: user.firstName,
          url,
          date: quotation.updatedAt,
          due_date: quotation.validity,
          total: quotation.price,
          support_url: this.supportPhoneNumber,
          logo: this.logo,
        },
      });
      this.logger.log(`Quotation successfully sent to user ${user.firstName}`);
    } catch (error) {
      this.logger.log(`Failed to sent quotation to user ${user.firstName}`);
    }
  }

  async sendInvoiceToUserByMail(user: User, order: Order) {
    const url = `${this.configService.get('USER_DASHBOARD_URL')}${user.id}`;
    try {
      await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Thank you for doing business | DBS Tyres',
        template: 'invoice', // `.hbs` extension is appended automatically
        context: {
          name: user.firstName,
          url,
          date: new Date(order.saleDate).toLocaleDateString('en-GB'),
          total: order.salePrice,
          platform_url: this.platformUrl,
          support_url: this.supportPhoneNumber,
          logo: this.logo,
        },
      });
      this.logger.log(
        `Sale order ${order.id} successfully send to ${user.firstName}`,
      );
    } catch (error) {
      this.logger.log(
        `Failed to send mail for sale order ${order.id} user ${user.firstName} error: ${error.message}`,
      );
    }
  }

  welcomeMail(user: User) {
    const url = `${this.configService.get('PROFILE_URL')}${user.id}`;
    try {
      this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to DBS Tyres! Lets get started',
        template: 'welcome', // `.hbs` extension is appended automatically
        context: {
          name: user.firstName,
          phoneNumber: user.phoneNumber,
          url,
          support_url: this.supportPhoneNumber,
          logo: this.logo,
        },
      });
      this.logger.log(
        `Welcome mail successfully sent to user ${user.firstName}`,
      );
    } catch (error) {
      this.logger.log(`Failed to sent Welcome mail to user ${user.firstName}`);
    }
  }
}
