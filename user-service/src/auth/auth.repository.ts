import { Injectable } from '@nestjs/common';
import { PrismaService } from '../data/prisma.service';
import { CreateUser, User } from '../types/user';

@Injectable()
export class AuthRepo {
  constructor(private readonly dbService: PrismaService) {}

  async createUser(user: CreateUser): Promise<User> {
    return this.dbService.user.create({
      data: user,
    });
  }

  async findUser(query: {
    id?: string;
    email?: string;
    userName?: string;
  }): Promise<User | null> {
    return this.dbService.user.findFirst({
      where: query,
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.dbService.user.delete({ where: { id } });
    return !!result;
  }
}
