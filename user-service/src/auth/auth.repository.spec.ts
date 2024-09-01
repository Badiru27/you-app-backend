import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepo } from './auth.repository';
import { PrismaService } from '../data/prisma.service';
import { CreateUser } from '../types/user';

describe('AuthRepo', () => {
  let repo: AuthRepo;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepo,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repo = module.get<AuthRepo>(AuthRepo);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and return the created user', async () => {
      const user: CreateUser = {
        email: 'test@example.com',
        userName: 'testuser',
        password: 'password',
      };
      const createdUser = { id: '1', ...user };

      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await repo.createUser(user);

      expect(result).toEqual(createdUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: user,
      });
    });
  });

  describe('findUser', () => {
    it('should find a user by ID', async () => {
      const userId = '1';
      const foundUser = {
        id: userId,
        email: 'test@example.com',
        userName: 'testuser',
        password: 'password',
      };

      mockPrismaService.user.findFirst.mockResolvedValue(foundUser);

      const result = await repo.findUser({ id: userId });

      expect(result).toEqual(foundUser);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should return null if no user is found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await repo.findUser({ email: 'nonexistent@example.com' });

      expect(result).toBeNull();
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return true', async () => {
      const userId = '1';

      mockPrismaService.user.delete.mockResolvedValue({ id: userId });

      const result = await repo.deleteUser(userId);

      expect(result).toBe(true);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
