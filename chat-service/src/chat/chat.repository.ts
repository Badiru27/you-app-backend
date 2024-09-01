import { Injectable } from '@nestjs/common';
import { MongoService } from '../data/mongo_db.service';
import {
  ChatMessage,
  CreateMessage,
  CreateRoom,
  Room,
  UserRoom,
} from 'src/types/chat';

@Injectable()
export class ChatRepo {
  constructor(private readonly dbService: MongoService) {}

  async createRoom(data: CreateRoom): Promise<string> {
    const result = await this.dbService.create('Room', {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    return result.insertedId.toString();
  }

  async findRoom(id: string): Promise<Room | null> {
    const result = await this.dbService.find('Room', { _id: id });

    return result && result.length > 0 ? (result[0] as Room) : null;
  }

  async addUserToRoom(data: {
    userId: string;
    roomId: string;
  }): Promise<string> {
    const result = await this.dbService.create('UserRoom', {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    return result.insertedId.toString();
  }

  async findUserRooms(userId: string): Promise<UserRoom[]> {
    const result = await this.dbService.find('UserRoom', { userId });
    return result as UserRoom[];
  }

  async findUserRoom(userId: string, roomId: string): Promise<UserRoom | null> {
    const result = await this.dbService.find('UserRoom', { userId, roomId });
    return result && result.length > 0 ? (result[0] as UserRoom) : null;
  }

  async createMessage(data: CreateMessage): Promise<string> {
    const result = await this.dbService.create('Message', {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    return result.insertedId.toString();
  }

  async findRoomMessages(
    roomId: string,
    limit?: number,
    skip?: number,
  ): Promise<ChatMessage[]> {
    const result = await this.dbService.find(
      'Message',
      { roomId },
      limit,
      skip,
    );
    return result as ChatMessage[];
  }
}
