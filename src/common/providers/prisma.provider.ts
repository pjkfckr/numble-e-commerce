import { PrismaClient } from '@prisma/client';

export namespace PrismaProvider {
  const PRISMA_CLIENT = new PrismaClient();

  export function getInstance(): PrismaClient {
    return PRISMA_CLIENT;
  }
}
