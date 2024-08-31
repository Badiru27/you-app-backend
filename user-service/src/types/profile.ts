import { Profile as PrismaProfile } from '@prisma/client';
import { User } from './user';

export type Profile = PrismaProfile & { user?: User };

export type UpdateProfile = Partial<
  Omit<
    Profile,
    'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'user'
  >
> & { userId: string };
