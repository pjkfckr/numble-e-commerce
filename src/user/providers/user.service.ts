import { IUserService } from './user.service.interface';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaProvider } from '../../common/providers/prisma.provider';
import { v4 as uuidV4 } from 'uuid';
import { User } from '../../common/structures/user';

@Injectable()
export class UserService implements IUserService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaProvider.getInstance();
  }

  async create(): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: { id: uuidV4() },
    });
    return createdUser;
  }
}
