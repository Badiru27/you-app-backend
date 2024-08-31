import { Profile as PrismaProfile } from '@prisma/client';

export type Profile = PrismaProfile;

export type UpdateProfile = Omit<
  Profile,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
