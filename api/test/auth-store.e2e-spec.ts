import { INestApplication } from '@nestjs/common';
import { authenticationStoreContract } from '@nestjs/authentication/testing';
import { App } from 'supertest/types.js';
import { PrismaRefreshTokenStore } from '../src/auth/prisma-refresh-token.store.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { createTestApp } from './helpers.js';

// The package's own contract suite, run against the Postgres-backed store,
// including the concurrency cases (parallel use of one refresh token).
describe('PrismaRefreshTokenStore contract (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  const cases = authenticationStoreContract(
    () => ({ refreshTokens: new PrismaRefreshTokenStore(prisma) }),
    { contracts: ['refreshTokens'], concurrent: true }
  );

  for (const c of cases) {
    it(c.name, () => c.run());
  }
});
