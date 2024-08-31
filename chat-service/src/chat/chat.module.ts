import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRepo } from './chat.repository';
import { DataModule } from 'src/data/data.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DataModule, JwtModule.register({})],
  providers: [ChatService, ChatGateway, ChatRepo],
  exports: [ChatService],
})
export class ChatModule {}
