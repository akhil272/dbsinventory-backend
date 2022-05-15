import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from '../users/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    SmsModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
