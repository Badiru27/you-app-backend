import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { ChatRepo } from './chat.repository';
import { ForbiddenException } from '@nestjs/common';

const mockChatRepo = {
  createRoom: jest.fn(),
  addUserToRoom: jest.fn(),
  findUserRoom: jest.fn(),
  createMessage: jest.fn(),
  findRoomMessages: jest.fn(),
  findUserRooms: jest.fn(),
  findRoom: jest.fn(),
};

describe('ChatService', () => {
  let service: ChatService;
  let repo: ChatRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService, { provide: ChatRepo, useValue: mockChatRepo }],
    }).compile();

    service = module.get<ChatService>(ChatService);
    repo = module.get<ChatRepo>(ChatRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  describe('createRoom', () => {
    it('should create a room and add the creator to the room', async () => {
      mockChatRepo.createRoom.mockResolvedValue('room-id');
      mockChatRepo.addUserToRoom.mockResolvedValue(undefined);

      const result = await service.createRoom({
        name: 'Test Room',
        createdBy: 'user-id',
      });

      expect(mockChatRepo.createRoom).toHaveBeenCalledWith({
        name: 'Test Room',
        createdBy: 'user-id',
      });
      expect(mockChatRepo.addUserToRoom).toHaveBeenCalledWith({
        userId: 'user-id',
        roomId: 'room-id',
      });
      expect(result).toBe('room-id');
    });
  });

  describe('joinRoom', () => {
    it('should add a user to the room if not already present', async () => {
      mockChatRepo.findUserRoom.mockResolvedValue(null); // Simulate user not in room
      mockChatRepo.addUserToRoom.mockResolvedValue(undefined);

      await service.joinRoom('room-id', 'user-id');

      expect(mockChatRepo.findUserRoom).toHaveBeenCalledWith(
        'user-id',
        'room-id',
      );
      expect(mockChatRepo.addUserToRoom).toHaveBeenCalledWith({
        userId: 'user-id',
        roomId: 'room-id',
      });
    });

    it('should not add a user if they are already in the room', async () => {
      mockChatRepo.findUserRoom.mockResolvedValue({}); // Simulate user already in room

      await service.joinRoom('room-id', 'user-id');

      expect(mockChatRepo.findUserRoom).toHaveBeenCalledWith(
        'user-id',
        'room-id',
      );
      expect(mockChatRepo.addUserToRoom).not.toHaveBeenCalled();
    });
  });

  describe('createMessage', () => {
    it('should create a message if the room exists', async () => {
      mockChatRepo.findRoom.mockReturnValue(Promise.resolve({})); // Room exists
      mockChatRepo.createMessage.mockResolvedValue('message-id');

      const result = await service.createMessage(
        'room-id',
        'user-id',
        'Hello World',
      );

      expect(mockChatRepo.findRoom).toHaveBeenCalledWith('room-id');
      expect(mockChatRepo.createMessage).toHaveBeenCalledWith({
        content: 'Hello World',
        userId: 'user-id',
        roomId: 'room-id',
      });
      expect(result).toBe('message-id');
    });

    it('should return null if the room does not exist', async () => {
      mockChatRepo.findRoom.mockReturnValue(Promise.resolve(null));

      const result = await service.createMessage(
        'room-id',
        'user-id',
        'Hello World',
      );

      expect(mockChatRepo.findRoom).toHaveBeenCalledWith('room-id');
      expect(result).toBeNull();
    });
  });

  describe('getRoomMessage', () => {
    it('should return messages if the user is in the room', async () => {
      mockChatRepo.findUserRoom.mockResolvedValue({});
      mockChatRepo.findRoomMessages.mockResolvedValue([
        { content: 'Hello', userId: 'user-id', roomId: 'room-id' },
      ]);

      const result = await service.getRoomMessage('room-id', 'user-id');

      expect(mockChatRepo.findUserRoom).toHaveBeenCalledWith(
        'user-id',
        'room-id',
      );
      expect(mockChatRepo.findRoomMessages).toHaveBeenCalledWith('room-id');
      expect(result).toEqual([
        { content: 'Hello', userId: 'user-id', roomId: 'room-id' },
      ]);
    });

    it('should throw a ForbiddenException if the user is not in the room', async () => {
      mockChatRepo.findUserRoom.mockResolvedValue(null);

      await expect(
        service.getRoomMessage('room-id', 'user-id'),
      ).rejects.toThrow(ForbiddenException);
      expect(mockChatRepo.findUserRoom).toHaveBeenCalledWith(
        'user-id',
        'room-id',
      );
    });
  });

  describe('getUserRooms', () => {
    it('should return the rooms the user is part of', async () => {
      const userRooms = [{ id: 'room-id', name: 'Test Room' }];
      mockChatRepo.findUserRooms.mockResolvedValue(userRooms);

      const result = await service.getUserRooms('user-id');

      expect(mockChatRepo.findUserRooms).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(userRooms);
    });
  });
});
