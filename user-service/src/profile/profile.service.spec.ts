import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { ProfileRepo } from './profile.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Profile } from '@src/types/profile';

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepo: ProfileRepo;

  const mockProfileRepo = {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: ProfileRepo, useValue: mockProfileRepo },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileRepo = module.get<ProfileRepo>(ProfileRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(profileRepo).toBeDefined();
  });

  describe('create', () => {
    it('should create a new profile and return it with zodiac and horoscope', async () => {
      const data = {
        userId: 'userId',
        displayName: 'John Doe',
        birthday: new Date('1990-01-15'),
        height: null,
        weight: null,
        imageUrl: null,
        interest: [],
      };

      const createdProfile = {
        id: '1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockProfileRepo.find.mockResolvedValue(null);
      mockProfileRepo.create.mockResolvedValue(createdProfile);

      const result = await service.create(data);

      expect(result).toEqual({
        ...createdProfile,
        zodiac: 'Capricorn',
        horoscope: 'Goat',
      });
      expect(mockProfileRepo.find).toHaveBeenCalledWith(data.userId);
      expect(mockProfileRepo.create).toHaveBeenCalledWith(data);
    });

    it('should throw ForbiddenException if profile already exists', async () => {
      const data = {
        userId: 'userId',
        displayName: 'John Doe',
        birthday: new Date('1990-01-15'),
        height: null,
        weight: null,
        imageUrl: null,
        interest: [],
      };

      mockProfileRepo.find.mockResolvedValue({
        id: '1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      await expect(service.create(data)).rejects.toThrow(ForbiddenException);
      expect(mockProfileRepo.find).toHaveBeenCalledWith(data.userId);
    });
  });

  describe('find', () => {
    it('should find a profile by userId and return it with zodiac and horoscope', async () => {
      const userId = 'userId';
      const profile: Profile = {
        id: '1',
        userId,
        displayName: 'John Doe',
        birthday: new Date('1990-01-15'),
        height: null,
        weight: null,
        imageUrl: null,
        gender: 'MALE',
        interest: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        user: {
          id: '1',
          password: 'password',
          email: 'email',
          userName: 'name',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      };

      mockProfileRepo.find.mockResolvedValue(profile);

      const result = await service.find(userId);

      expect(result).toEqual({
        ...profile,
        zodiac: 'Capricorn',
        horoscope: 'Goat',
      });
      expect(mockProfileRepo.find).toHaveBeenCalledWith(userId);
    });

    it('should handle missing profile gracefully', async () => {
      const userId = 'userId';

      mockProfileRepo.find.mockResolvedValue(null);

      await expect(service.find(userId)).rejects.toThrow(NotFoundException);
      expect(mockProfileRepo.find).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a profile and return it with zodiac and horoscope', async () => {
      const data = {
        userId: 'userId',
        displayName: 'Jane Doe',
        birthday: new Date('1990-01-15'),
        height: null,
        weight: null,
        imageUrl: null,
        interest: [],
      };

      const existingProfile = {
        id: '1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updatedProfile = {
        ...existingProfile,
        displayName: 'Jane Doe',
        updatedAt: new Date(),
      };

      mockProfileRepo.find.mockResolvedValue(existingProfile);
      mockProfileRepo.update.mockResolvedValue(updatedProfile);

      const result = await service.update(data);

      expect(result).toEqual({
        ...updatedProfile,
        zodiac: 'Capricorn',
        horoscope: 'Goat',
      });
      expect(mockProfileRepo.find).toHaveBeenCalledWith(data.userId);
      expect(mockProfileRepo.update).toHaveBeenCalledWith(existingProfile.id, {
        ...data,
        userId: undefined,
      });
    });

    it('should throw NotFoundException if profile is not found', async () => {
      const data = {
        userId: 'userId',
        displayName: 'Jane Doe',
        birthday: new Date('1990-01-15'),
        height: null,
        weight: null,
        imageUrl: null,
        interest: [],
      };

      mockProfileRepo.find.mockResolvedValue(null);

      await expect(service.update(data)).rejects.toThrow(NotFoundException);
      expect(mockProfileRepo.find).toHaveBeenCalledWith(data.userId);
    });
  });
});
