import { Injectable } from '@nestjs/common';
import { PrismaService } from '../data/prisma.service';
import { Profile, UpdateProfile } from '../types/profile';
import { removeNulls } from '../utils';

@Injectable()
export class ProfileRepo {
  constructor(private readonly dbService: PrismaService) {}

  async create(data: UpdateProfile): Promise<Profile> {
    return this.dbService.profile.create({ data });
  }

  async find(userId: string): Promise<Profile | null> {
    return this.dbService.profile.findFirst({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async update(
    id: string,
    data: Omit<UpdateProfile, 'userId'>,
  ): Promise<Profile> {
    const dataWithoutNull = removeNulls(data);
    return this.dbService.profile.update({
      data: dataWithoutNull,
      where: { id },
    });
  }
}
