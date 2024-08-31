import { User as PrismaUser } from '@prisma/client';

export type User = PrismaUser;

export type CreateUser = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
