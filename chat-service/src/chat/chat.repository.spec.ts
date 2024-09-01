import { Test, TestingModule } from '@nestjs/testing';
import { ChatRepo } from './chat.repository';
import { MongoService } from '../data/mongo_db.service';
import {
  ChatMessage,
  CreateMessage,
  CreateRoom,
  Room,
  UserRoom,
} from '@src/types';

describe('ChatRepo', () => {
  let chatRepo: ChatRepo;
  let mongoService: MongoService;

  const mockMongoService = {
    create: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatRepo,
        { provide: MongoService, useValue: mockMongoService },
      ],
    }).compile();

    chatRepo = module.get<ChatRepo>(ChatRepo);
    mongoService = module.get<MongoService>(MongoService);
  });

  it('should be defined', () => {
    expect(chatRepo).toBeDefined();
    expect(mongoService).toBeDefined();
  });

  describe('createRoom', () => {
    it('should create a room and return its ID', async () => {
      const mockInsertedId = 'mockRoomId';
      mockMongoService.create.mockResolvedValue({
        insertedId: mockInsertedId,
      });

      const roomData: CreateRoom = { name: 'Test Room', createdBy: 'user1' };
      const result = await chatRepo.createRoom(roomData);

      expect(mockMongoService.create).toHaveBeenCalledWith(
        'Room',
        expect.objectContaining({
          ...roomData,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: null,
        }),
      );
      expect(result).toBe(mockInsertedId);
    });
  });

  describe('findRoom', () => {
    it('should find and return a room', async () => {
      const mockRoom: Room = {
        id: 'mockRoomId',
        name: 'Test Room',
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      mockMongoService.find.mockResolvedValue([mockRoom]);

      const result = await chatRepo.findRoom('mockRoomId');

      expect(mockMongoService.find).toHaveBeenCalledWith('Room', {
        _id: 'mockRoomId',
      });
      expect(result).toEqual(mockRoom);
    });

    it('should return null if room not found', async () => {
      mockMongoService.find.mockResolvedValue([]);

      const result = await chatRepo.findRoom('nonExistingRoomId');

      expect(result).toBeNull();
    });
  });

  describe('addUserToRoom', () => {
    it('should add a user to a room and return its ID', async () => {
      const mockInsertedId = 'mockUserRoomId';
      mockMongoService.create.mockResolvedValue({
        insertedId: mockInsertedId,
      });

      const userRoomData = { userId: 'user1', roomId: 'room1' };
      const result = await chatRepo.addUserToRoom(userRoomData);

      expect(mockMongoService.create).toHaveBeenCalledWith(
        'UserRoom',
        expect.objectContaining({
          ...userRoomData,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: null,
        }),
      );
      expect(result).toBe(mockInsertedId);
    });
  });

  describe('findUserRooms', () => {
    it('should return rooms associated with a user', async () => {
      const mockUserRooms: UserRoom[] = [
        {
          id: 'mockUserRoomId',
          userId: 'user1',
          roomId: 'room1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      mockMongoService.find.mockResolvedValue(mockUserRooms);

      const result = await chatRepo.findUserRooms('user1');

      expect(mockMongoService.find).toHaveBeenCalledWith('UserRoom', {
        userId: 'user1',
      });
      expect(result).toEqual(mockUserRooms);
    });
  });

  describe('findUserRoom', () => {
    it('should return a user room if found', async () => {
      const mockUserRoom: UserRoom = {
        id: 'mockUserRoomId',
        userId: 'user1',
        roomId: 'room1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      mockMongoService.find.mockResolvedValue([mockUserRoom]);

      const result = await chatRepo.findUserRoom('user1', 'room1');

      expect(mockMongoService.find).toHaveBeenCalledWith('UserRoom', {
        userId: 'user1',
        roomId: 'room1',
      });
      expect(result).toEqual(mockUserRoom);
    });

    it('should return null if user room not found', async () => {
      mockMongoService.find.mockResolvedValue([]);

      const result = await chatRepo.findUserRoom('user1', 'room1');

      expect(result).toBeNull();
    });
  });

  describe('createMessage', () => {
    it('should create a message and return its ID', async () => {
      const mockInsertedId = 'mockMessageId';
      mockMongoService.create.mockResolvedValue({
        insertedId: mockInsertedId,
      });

      const messageData: CreateMessage = {
        roomId: 'room1',
        userId: 'user1',
        content: 'Hello',
      };
      const result = await chatRepo.createMessage(messageData);

      expect(mockMongoService.create).toHaveBeenCalledWith(
        'Message',
        expect.objectContaining({
          ...messageData,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: null,
        }),
      );
      expect(result).toBe(mockInsertedId);
    });
  });

  describe('findRoomMessages', () => {
    it('should return messages from a room', async () => {
      const mockMessages: ChatMessage[] = [
        {
          id: 'message1',
          roomId: 'room1',
          userId: 'user1',
          content: 'Hello',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      mockMongoService.find.mockResolvedValue(mockMessages);

      const result = await chatRepo.findRoomMessages('room1');

      expect(mockMongoService.find).toHaveBeenCalledWith(
        'Message',
        { roomId: 'room1' },
        undefined,
        undefined,
      );
      expect(result).toEqual(mockMessages);
    });
  });
});
