import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepo } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';
import { User } from '../types/user';
import { ProfileService } from '../profile/profile.service';

describe('AuthService', () => {
  let service: AuthService;
  let authRepo: AuthRepo;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockAuthRepo = {
    createUser: jest.fn(),
    findUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockProfileService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepo, useValue: mockAuthRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepo = module.get<AuthRepo>(AuthRepo);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authRepo).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('assignUserAToken', () => {
    it('should generate a token for the user', async () => {
      const user: User = {
        id: '1',
        userName: 'testuser',
        email: 'test@email.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const token = 'mockToken';

      mockJwtService.signAsync.mockResolvedValue(token);
      mockConfigService.get.mockImplementation((key) => {
        if (key === 'JWT_EXPIRES') return '1h';
        if (key === 'JWT_KEY') return 'secret';
      });

      const result = await service.assignUserAToken(user);

      expect(result).toEqual({ token });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { id: user.id, userName: user.userName },
        {
          expiresIn: '1h',
          secret: 'secret',
        },
      );
    });
  });

  describe('registerUser', () => {
    it('should register a new user and return a token', async () => {
      const user = {
        email: 'test@example.com',
        userName: 'testuser',
        password: 'password',
      };
      const hashedPassword = 'hashedPassword';
      const createdUser = { id: '1', ...user };
      const token = 'mockToken';

      mockAuthRepo.findUser.mockResolvedValue(null); // No existing user
      mockAuthRepo.createUser.mockResolvedValue(createdUser);
      jest.spyOn(argon, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(service, 'assignUserAToken').mockResolvedValue({ token });

      const result = await service.registerUser(user);

      expect(result).toEqual({ token });
      expect(mockAuthRepo.findUser).toHaveBeenCalledWith({
        email: user.email.toLowerCase(),
      });
      expect(argon.hash).toHaveBeenCalledWith(user.password);
      expect(mockAuthRepo.createUser).toHaveBeenCalledWith({
        ...user,
        email: user.email.toLowerCase(),
        password: hashedPassword,
      });
      expect(service.assignUserAToken).toHaveBeenCalledWith(createdUser);
    });

    it('should throw ForbiddenException if user already exists', async () => {
      const user = {
        email: 'test@example.com',
        userName: 'testuser',
        password: 'password',
      };

      mockAuthRepo.findUser.mockResolvedValue({ id: '1', ...user }); // Existing user

      await expect(service.registerUser(user)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('loginUser', () => {
    it('should log in a user and return a token', async () => {
      const data = { email: 'test@example.com', password: 'password' };
      const user = {
        id: '1',
        email: data.email,
        userName: 'testuser',
        password: 'hashedPassword',
      };
      const token = 'mockToken';

      mockAuthRepo.findUser.mockResolvedValue(user);
      jest.spyOn(argon, 'verify').mockResolvedValue(true);
      jest.spyOn(service, 'assignUserAToken').mockResolvedValue({ token });

      const result = await service.loginUser(data);

      expect(result).toEqual({ token });
      expect(mockAuthRepo.findUser).toHaveBeenCalledWith({
        email: data.email.toLowerCase(),
      });
      expect(argon.verify).toHaveBeenCalledWith(user.password, data.password);
      expect(service.assignUserAToken).toHaveBeenCalledWith(user);
    });

    it('should throw ForbiddenException if credentials are invalid', async () => {
      const data = { email: 'test@example.com', password: 'wrongPassword' };
      const user = {
        id: '1',
        email: data.email,
        userName: 'testuser',
        password: 'hashedPassword',
      };

      mockAuthRepo.findUser.mockResolvedValue(user);
      jest.spyOn(argon, 'verify').mockResolvedValue(false); // Invalid password

      await expect(service.loginUser(data)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user does not exist', async () => {
      const data = { email: 'nonexistent@example.com', password: 'password' };

      mockAuthRepo.findUser.mockResolvedValue(null); // No user found

      await expect(service.loginUser(data)).rejects.toThrow(ForbiddenException);
    });
  });
});
