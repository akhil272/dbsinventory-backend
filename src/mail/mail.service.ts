import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import VerificationTokenPayload from './verificationTokenPayload.interface';

@Injectable()
export class MailService {
  constructor(
    private readonly jwtService: JwtService,
    private mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

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
      template: 'confirmation', // `.hbs` extension is appended automatically
      context: {
        name: user.firstName,
        url,
      },
    });
  }

  async confirmEmail(email: string) {
    const user = await this.usersService.getUserByMail(email);
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
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

  async sendQuotationToUserByMail(user: User, quotation) {
    const url = `${this.configService.get(
      'BASE_URL',
    )}/manage-quotations/download/pdf/${quotation.id}`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Your Quotation is ready | DBS Tyres',
      template: 'sendQuotation', // `.hbs` extension is appended automatically
      context: {
        name: user.firstName,
        url,
      },
    });
  }
}
