import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/data/prisma.service';
import { CreateUser, User } from 'src/types/user';

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
    return !!(await this.dbService.user.delete({ where: { id } }));
  }
}
