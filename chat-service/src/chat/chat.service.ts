import { ForbiddenException, Injectable } from '@nestjs/common';
import { ChatMessage, CreateRoom, UserRoom } from 'src/types/chat';
import { ChatRepo } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepo: ChatRepo) {}

  async createRoom(data: CreateRoom): Promise<string> {
    const id = await this.chatRepo.createRoom(data);
    await this.chatRepo.addUserToRoom({ userId: data.createdBy, roomId: id });
    return id;
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await this.chatRepo.findUserRoom(userId, roomId);
    if (room) return;

    await this.chatRepo.addUserToRoom({ userId, roomId });
  }

  async createMessage(
    roomId: string,
    userId: string,
    message: string,
  ): Promise<string | null> {
    const room = await this.chatRepo.findRoom(roomId);
    if (room) {
      return this.chatRepo.createMessage({
        content: message,
        userId,
        roomId,
      });
    }
    return null;
  }

  async getRoomMessage(roomId: string, userId: string): Promise<ChatMessage[]> {
    const room = await this.chatRepo.findUserRoom(userId, roomId);

    if (!room) throw new ForbiddenException('User not in chat room');

    return this.chatRepo.findRoomMessages(roomId);
  }

  async getUserRooms(userId: string): Promise<UserRoom[]> {
    return this.chatRepo.findUserRooms(userId);
  }
}
