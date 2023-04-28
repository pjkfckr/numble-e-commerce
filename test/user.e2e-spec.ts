import { INestApplication } from '@nestjs/common';
import { testInit } from './test.config';
import request from 'supertest';
import { PrismaProvider } from '../src/common/providers/prisma.provider';

const mockData = {
  user_id: '',
};

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await testInit();
  });

  afterAll(async () => {
    const prisma = PrismaProvider.getInstance();
    await prisma.user.delete({ where: { id: mockData.user_id } });
  });
  it('/users/sign-up (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/users/sign-up');
    expect(response.status).toBe(201);

    mockData.user_id = response.body.data.id;
  });
});
