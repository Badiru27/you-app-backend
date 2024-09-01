import { Test, TestingModule } from '@nestjs/testing';
import { ProfileRepo } from './profile.repository';
import { PrismaService } from '../data/prisma.service';
import { removeNulls } from '../utils';
import { UpdateProfile } from '../types/profile';

jest.mock('../utils', () => ({
  removeNulls: jest.fn(),
}));

describe('ProfileRepo', () => {
  let repo: ProfileRepo;
  let dbService: PrismaService;

  const mockDbService = {
    profile: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileRepo,
        { provide: PrismaService, useValue: mockDbService },
      ],
    }).compile();

    repo = module.get<ProfileRepo>(ProfileRepo);
    dbService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
    expect(dbService).toBeDefined();
  });
  describe('create', () => {
    it('should create a new profile', async () => {
      const createData: UpdateProfile = {
        userId: 'userId',
        displayName: 'John Doe',
        gender: null,
        birthday: null,
        height: null,
        weight: null,
        imageUrl: null,
        interest: [],
      };

      const newProfile = {
        id: '1',
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockDbService.profile.create.mockResolvedValue(newProfile);

      const result = await repo.create(createData);

      expect(result).toEqual(newProfile);
      expect(mockDbService.profile.create).toHaveBeenCalledWith({
        data: createData,
      });
    });
  });

  describe('find', () => {
    it('should find a profile by userId', async () => {
      const userId = 'userId';
      const foundProfile = {
        id: '1',
        userId,
        displayName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockDbService.profile.findFirst.mockResolvedValue(foundProfile);

      const result = await repo.find(userId);

      expect(result).toEqual(foundProfile);
      expect(mockDbService.profile.findFirst).toHaveBeenCalledWith({
        where: { userId },
        include: { user: true },
      });
    });

    it('should return null if no profile is found', async () => {
      const userId = 'userId';

      mockDbService.profile.findFirst.mockResolvedValue(null);

      const result = await repo.find(userId);

      expect(result).toBeNull();
      expect(mockDbService.profile.findFirst).toHaveBeenCalledWith({
        where: { userId },
        include: { user: true },
      });
    });
  });

  describe('update', () => {
    it('should update a profile by id', async () => {
      const id = '1';
      const updateData = {
        displayName: 'Jane Doe',
        gender: null,
        birthday: null,
        height: null,
        weight: null,
        imageUrl: null,
        interest: [],
      };
      const cleanData = {
        displayName: 'Jane Doe',
        gender: undefined,
        birthday: undefined,
        height: undefined,
        weight: undefined,
        imageUrl: undefined,
        interest: [],
      };
      const updatedProfile = {
        id,
        userId: 'userId',
        ...cleanData,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      // Mock the implementation of removeNulls
      (removeNulls as jest.Mock).mockImplementation((data) => {
        return {
          ...data,
          gender: data.gender === null ? undefined : data.gender,
          birthday: data.birthday === null ? undefined : data.birthday,
          height: data.height === null ? undefined : data.height,
          weight: data.weight === null ? undefined : data.weight,
          imageUrl: data.imageUrl === null ? undefined : data.imageUrl,
        };
      });

      mockDbService.profile.update.mockResolvedValue(updatedProfile);

      const result = await repo.update(id, updateData);

      expect(result).toEqual(updatedProfile);
      expect(mockDbService.profile.update).toHaveBeenCalledWith({
        data: cleanData,
        where: { id },
      });
    });
  });
});
