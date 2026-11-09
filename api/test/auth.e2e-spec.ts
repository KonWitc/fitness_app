import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { createTestApp, registerUser } from './helpers.js';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  const api = () => request(app.getHttpServer());

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers, then GET /me returns the user without the hash', async () => {
    const session = await registerUser(app);
    expect(session.accessToken).toBeTruthy();
    expect(session.refreshToken).toBeTruthy();
    expect(session.expiresIn).toBeGreaterThan(0);

    const me = await api()
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${session.accessToken}`)
      .expect(200);
    expect(me.body).toEqual(session.user);
    expect(me.body).not.toHaveProperty('passwordHash');
  });

  it('validates registration and rejects duplicate emails', async () => {
    await api()
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'long enough pw' })
      .expect(400)
      .expect({ error: 'Enter a valid email address' });

    await api()
      .post('/api/auth/register')
      .send({ email: 'short@test.local', password: 'short' })
      .expect(400)
      .expect({ error: 'Password must be at least 8 characters' });

    const session = await registerUser(app);
    await api()
      .post('/api/auth/register')
      .send({
        email: `  ${session.email.toUpperCase()} `,
        password: 'another password',
      })
      .expect(409)
      .expect({ error: 'An account with this email already exists' });
  });

  it('signs in with normalized email; wrong password is a 401', async () => {
    const session = await registerUser(app);

    const ok = await api()
      .post('/api/auth/token')
      .send({ email: session.email.toUpperCase(), password: session.password })
      .expect(200);
    expect(ok.body.user.id).toBe(session.user.id);

    await api()
      .post('/api/auth/token')
      .send({ email: session.email, password: 'wrong password' })
      .expect(401)
      .expect({ error: 'Invalid email or password' });

    await api()
      .post('/api/auth/token')
      .send({ email: 'nobody@test.local', password: 'whatever123' })
      .expect(401)
      .expect({ error: 'Invalid email or password' });
  });

  it('rotates refresh tokens and revokes the family on reuse', async () => {
    const session = await registerUser(app);

    const first = await api()
      .post('/api/auth/token/refresh')
      .send({ refreshToken: session.refreshToken })
      .expect(200);
    expect(first.body.refreshToken).not.toBe(session.refreshToken);

    // Replaying the spent token = theft: 401, and the whole family dies...
    await api()
      .post('/api/auth/token/refresh')
      .send({ refreshToken: session.refreshToken })
      .expect(401);

    // ...including the legitimately rotated successor.
    await api()
      .post('/api/auth/token/refresh')
      .send({ refreshToken: first.body.refreshToken })
      .expect(401);
  });

  it('logout revokes the refresh token', async () => {
    const session = await registerUser(app);

    await api()
      .post('/api/auth/logout')
      .send({ refreshToken: session.refreshToken })
      .expect(204);
    await api()
      .post('/api/auth/token/refresh')
      .send({ refreshToken: session.refreshToken })
      .expect(401);

    // Unknown tokens get the same answer: logout reveals nothing.
    await api()
      .post('/api/auth/logout')
      .send({ refreshToken: 'not-a-real-token' })
      .expect(204);
  });

  it('rejects a tampered access token', async () => {
    const session = await registerUser(app);
    const tampered = session.accessToken.slice(0, -2) + 'xx';
    const res = await api()
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tampered}`)
      .expect(401);
    // Bearer failures follow RFC 6750: the reason is in WWW-Authenticate.
    expect(res.headers['www-authenticate']).toContain('error="invalid_token"');
    expect(typeof res.body.error).toBe('string');
  });

  it('hides other users’ workouts', async () => {
    const owner = await registerUser(app);
    const other = await registerUser(app);
    const workout = await app.get(PrismaService).workout.create({
      data: { userId: owner.user.id, name: 'Private' },
    });

    await api()
      .get(`/api/workouts/${workout.id}`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(200);
    await api()
      .get(`/api/workouts/${workout.id}`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);
  });
});
