import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersRepository } from '../users/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { RefreshTokenRepository } from './refresh-token.repository';
import { SmsModule } from 'src/sms/sms.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    SmsModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '3d',
        },
      }),
    }),
    TypeOrmModule.forFeature([UsersRepository]),
    TypeOrmModule.forFeature([RefreshTokenRepository]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
