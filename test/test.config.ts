import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from '../src/common/filters/prisma-client-exception.filter';

export async function testInit() {
  let application: INestApplication;
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  application = moduleFixture.createNestApplication();
  const { httpAdapter } = application.get(HttpAdapterHost);
  application.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  application.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  await application.init();
  return application;
}
