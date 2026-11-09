import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/setup.js';

export async function createTestApp(): Promise<INestApplication<App>> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication<INestApplication<App>>();
  configureApp(app);
  await app.init();
  return app;
}

export interface TestSession {
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: string; email: string; name: string | null };
}

/** Registers a fresh account (unique email per call) and returns its session. */
export async function registerUser(
  app: INestApplication<App>
): Promise<TestSession> {
  const email = `e2e-${randomUUID()}@test.local`;
  const password = 'correct horse battery';
  const res = await request(app.getHttpServer())
    .post('/api/auth/register')
    .send({ email, password, name: 'E2E' })
    .expect(201);
  return { email, password, ...res.body };
}
