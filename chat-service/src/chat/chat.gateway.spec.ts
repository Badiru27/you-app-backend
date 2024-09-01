import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { WsGuard } from '../auth/guard/ws.guard';
import { INestApplication } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { CanActivate } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let chatService: ChatService;
  let mockServer: Partial<Server>;
  let app: INestApplication;

  const mockChatService = {
    createRoom: jest.fn(),
    joinRoom: jest.fn(),
    createMessage: jest.fn(),
    getUserRooms: jest.fn(),
  };

  const mockSocket = {
    id: 'mockClientId',
    join: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    handshake: { headers: { authorization: 'Bearer mockToken' } },
    on: jest.fn(),
    user: { id: 'mockUserId', userName: 'mock' },
  } as unknown as Socket;

  const mockWsGuard: CanActivate = {
    canActivate: jest.fn((context: ExecutionContext) => {
      const client = context.switchToWs().getClient<Socket>();
      client['user'] = { id: 'mockUserId', userName: 'mock' };
      return true;
    }),
  };

  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ id: 'mockUserId', userName: 'mock' }),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_KEY') return 'mockSecretKey';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: ChatService, useValue: mockChatService },
        { provide: WsGuard, useValue: mockWsGuard },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
      imports: [JwtModule.register({})],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    gateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);
    mockServer = { to: jest.fn().mockReturnThis(), emit: jest.fn() };
    gateway.server = mockServer as Server;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
    expect(chatService).toBeDefined();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
    expect(chatService).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should log client connection', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      gateway.handleConnection(mockSocket);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Client connected: ${mockSocket.id},`,
      );
    });
  });

  describe('handleDisconnect', () => {
    it('should log client disconnection', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      gateway.handleDisconnect(mockSocket);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Client disconnected: ${mockSocket.id}`,
      );
    });
  });

  describe('handleCreateRoom', () => {
    it('should create a room and let client join', async () => {
      const roomId = 'mockRoomId';
      mockChatService.createRoom.mockResolvedValue(roomId);

      await gateway.handleCreateRoom(mockSocket, { roomName: 'Test Room' });

      expect(mockChatService.createRoom).toHaveBeenCalledWith({
        createdBy: 'mockUserId',
        name: 'Test Room',
      });
      expect(mockSocket.join).toHaveBeenCalledWith(roomId);
    });
  });

  describe('handleJoinRoom', () => {
    it('should allow user to join a room and notify others', async () => {
      const roomId = 'mockRoomId';
      await gateway.handleJoinRoom({ roomId }, mockSocket);

      expect(mockChatService.joinRoom).toHaveBeenCalledWith(
        roomId,
        'mockUserId',
      );
      expect(mockSocket.join).toHaveBeenCalledWith(roomId);
      expect(mockServer.to).toHaveBeenCalledWith(roomId);
      expect(mockServer.emit).toHaveBeenCalledWith('userJoined', {
        userId: 'mockUserId',
        roomId,
      });
    });
  });

  describe('handleSendMessage', () => {
    it('should create a message and broadcast to room', async () => {
      const roomId = 'mockRoomId';
      const message = 'Hello World';

      await gateway.handleSendMessage({ roomId, message }, mockSocket);

      expect(mockChatService.createMessage).toHaveBeenCalledWith(
        roomId,
        'mockUserId',
        message,
      );
      expect(mockServer.to).toHaveBeenCalledWith(roomId);
      expect(mockServer.emit).toHaveBeenCalledWith('newMessage', {
        roomId,
        sender: 'mockUserId',
      });
    });
  });

  describe('identifyUser', () => {
    it('should allow a user to join their existing rooms', async () => {
      const mockUserRooms = [{ roomId: 'room1' }, { roomId: 'room2' }];
      mockChatService.getUserRooms.mockResolvedValue(mockUserRooms);

      await gateway.identifyUser(mockSocket);

      expect(mockChatService.getUserRooms).toHaveBeenCalledWith('mockUserId');
      expect(mockSocket.join).toHaveBeenCalledWith('room1');
      expect(mockSocket.join).toHaveBeenCalledWith('room2');
    });
  });
});
