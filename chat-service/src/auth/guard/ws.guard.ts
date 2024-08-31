import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: any): boolean | Promise<boolean> {
    const client = context.switchToWs().getClient() as Socket;
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) {
      console.log('Authorization header missing');
      client.disconnect();
      return false;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('Token missing from Authorization header');
      client.disconnect();
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_KEY'),
      });

      client['user'] = decoded;

      return true;
    } catch (error) {
      console.error('Invalid JWT token', error);
      client.disconnect(); // Disconnect the client on invalid token
      return false;
    }
  }
}
