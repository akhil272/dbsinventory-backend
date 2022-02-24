import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthCredentialsDto,
  SignInCredentialsDto,
} from './dto/auth-credentials.dto';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string; userRole: string }> {
    const { username, password } = signInCredentialsDto;

    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      const userRole = user.roles
      return { accessToken, userRole };
    } else {
      throw new UnauthorizedException('Please check your login credentials.');
    }
  }
}
