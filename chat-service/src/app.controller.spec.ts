import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ChatService } from './chat/chat.service';
import { Request } from 'express';
import { ChatMessage, UserRoom } from './types/chat';

describe('AppController', () => {
  let appController: AppController;
  let chatService: ChatService;

  const mockChatService = {
    getRoomMessage: jest.fn(),
    getUserRooms: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: ChatService, useValue: mockChatService }],
    }).compile();

    appController = module.get<AppController>(AppController);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
    expect(chatService).toBeDefined();
  });

  describe('getHello', () => {
    it('should return a health message', () => {
      expect(appController.getHello()).toEqual({
        message: 'Hello from Chat Service of You App 🚀🚀🚀',
      });
    });
  });

  describe('getRoomMessage', () => {
    it('should return chat messages for a room', async () => {
      const roomId = 'roomId';
      const userId = 'userId';
      const mockMessages: ChatMessage[] = [
        {
          id: 'messageId1',
          roomId,
          userId,
          content: 'Hello',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 'messageId2',
          roomId,
          userId,
          content: 'Hi',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      (mockChatService.getRoomMessage as jest.Mock).mockResolvedValue(
        mockMessages,
      );

      const req = { user: { id: userId } } as unknown as Request;
      const result = await appController.getRoomMessage(roomId, req);

      expect(mockChatService.getRoomMessage).toHaveBeenCalledWith(
        roomId,
        userId,
      );
      expect(result).toEqual({
        data: mockMessages,
        success: true,
        message: 'chat messages',
      });
    });
  });

  describe('getUserRoom', () => {
    it('should return user rooms', async () => {
      const userId = 'userId';
      const mockUserRooms: UserRoom[] = [
        {
          id: 'userRoomId1',
          userId,
          roomId: 'roomId1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 'userRoomId1',
          userId,
          roomId: 'roomId2',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      (mockChatService.getUserRooms as jest.Mock).mockResolvedValue(
        mockUserRooms,
      );

      const req = { user: { id: userId } } as unknown as Request;
      const result = await appController.getUserRoom(req);

      expect(mockChatService.getUserRooms).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        data: mockUserRooms,
        success: true,
        message: 'user rooms',
      });
    });
  });
});
