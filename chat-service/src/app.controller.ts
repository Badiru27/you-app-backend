import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat/chat.service';
import { JwtGuard } from './auth/guard';
import { ChatMessage, UserRoom } from './types/chat';
import { Request } from 'express';
import { ResultResponse } from './utils';

@Controller()
export class AppController {
  constructor(private readonly chatService: ChatService) {}
  @Get('/health')
  getHello() {
    return {
      message: 'Hello from Chat Service of You App 🚀🚀🚀',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Get('/viewMessages/:roomId')
  async getRoomMessage(
    @Param('roomId') roomId: string,
    @Req() req: Request,
  ): Promise<ResultResponse<ChatMessage[]>> {
    const data = await this.chatService.getRoomMessage(roomId, req.user['id']);
    return {
      data,
      success: true,
      message: 'chat messages',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Get('/getUserRooms')
  async getUserRoom(@Req() req: Request): Promise<ResultResponse<UserRoom[]>> {
    const data = await this.chatService.getUserRooms(req.user['id']);
    return {
      data,
      success: true,
      message: 'user rooms',
    };
  }
}
