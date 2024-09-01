import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { ProfileService } from './profile/profile.service';
import { Request } from 'express';
import { CreateUserDto, LoginUserDto, UpdateProfileDto } from './dtos';

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;
  let profileService: ProfileService;

  const mockAuthService = {
    loginUser: jest.fn(),
    registerUser: jest.fn(),
  };

  const mockProfileService = {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    authService = module.get<AuthService>(AuthService);
    profileService = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(profileService).toBeDefined();
    expect(appController).toBeDefined();
  });

  describe('getHello', () => {
    it('should return a health check message', () => {
      expect(appController.getHello()).toEqual({
        message: 'Hello from User Service of You App 🚀🚀🚀',
      });
    });
  });

  describe('signIn', () => {
    it('should call AuthService.loginUser and return the token', async () => {
      const dto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const result = { token: 'mockToken' };
      mockAuthService.loginUser.mockResolvedValue(result);

      expect(await appController.signIn(dto)).toEqual(result);
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('signUp', () => {
    it('should call AuthService.registerUser and return the token', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        userName: 'testuser',
        password: 'password',
      };
      const result = { token: 'mockToken' };
      mockAuthService.registerUser.mockResolvedValue(result);

      expect(await appController.signUp(dto)).toEqual(result);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUserProfile', () => {
    it('should call ProfileService.find and return the user profile', async () => {
      const userId = 'userId';
      const req: Partial<Request> = {
        user: { id: userId },
      } as unknown as Request;
      const profileData = {
        id: '1',
        userId,
        displayName: 'John Doe',
        birthday: new Date(),
        zodiac: 'Capricorn',
        horoscope: 'Goat',
      };
      mockProfileService.find.mockResolvedValue(profileData);

      expect(await appController.getUserProfile(req as Request)).toEqual({
        data: profileData,
        success: true,
        message: 'Profile fetched successfully',
      });
      expect(mockProfileService.find).toHaveBeenCalledWith(userId);
    });
  });

  describe('createProfile', () => {
    it('should call ProfileService.create and return the created profile with zodiac and horoscope', async () => {
      const userId = 'userId';
      const dto: UpdateProfileDto = {
        displayName: 'John Doe',
        birthday: new Date('1990-01-15'),
      };
      const profileData = {
        id: '1',
        userId,
        ...dto,
        zodiac: 'Capricorn',
        horoscope: 'Goat',
      };
      const req: Partial<Request> = {
        user: { id: userId },
      } as unknown as Request;
      mockProfileService.create.mockResolvedValue(profileData);

      expect(await appController.createProfile(dto, req as Request)).toEqual({
        data: profileData,
        success: true,
        message: 'Profile created successfully',
      });
      expect(mockProfileService.create).toHaveBeenCalledWith({
        ...dto,
        userId,
      });
    });
  });

  describe('updateProfile', () => {
    it('should call ProfileService.update and return the updated profile with zodiac and horoscope', async () => {
      const userId = 'userId';
      const dto: UpdateProfileDto = {
        displayName: 'Jane Doe',
        birthday: new Date('1990-01-15'),
      };
      const profileData = {
        id: '1',
        userId,
        ...dto,
        zodiac: 'Capricorn',
        horoscope: 'Goat',
      };
      const req: Partial<Request> = {
        user: { id: userId },
      } as unknown as Request;
      mockProfileService.update.mockResolvedValue(profileData);

      expect(await appController.updateProfile(dto, req as Request)).toEqual({
        data: profileData,
        success: true,
        message: 'Profile update successfully',
      });
      expect(mockProfileService.update).toHaveBeenCalledWith({
        ...dto,
        userId,
      });
    });
  });
});
