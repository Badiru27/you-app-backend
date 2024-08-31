import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUser, User } from 'src/types/user';
import { AuthRepo } from './auth.repository';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly authRepo: AuthRepo,
  ) {}

  async assignUserAToken(user: User): Promise<{ token: string }> {
    const payload = { id: user.id, userName: user.userName };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES'),
      secret: this.configService.get('JWT_KEY'),
    });

    return {
      token: token,
    };
  }

  async registerUser(user: CreateUser): Promise<{ token: string }> {
    const exitUser = await this.authRepo.findUser({ email: user.email });

    if (exitUser) {
      throw new ForbiddenException('User Already Registered');
    }

    const hash = await argon.hash(user.password);
    const userCreated = await this.authRepo.createUser({
      ...user,
      password: hash,
    });

    return this.assignUserAToken(userCreated);
  }

  async loginUser(data: {
    email?: string;
    userName?: string;
    password: string;
  }): Promise<{ token: string }> {
    const user = await this.authRepo.findUser({
      email: data.email,
      userName: data.userName,
    });
    if (!user) throw new ForbiddenException('Invalid Credentials');

    const hash = await argon.verify(user.password, data.password);
    if (!hash) throw new ForbiddenException('Invalid Credentials');

    return this.assignUserAToken(user);
  }
}
