import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

@Module({
  imports: [ChatModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
