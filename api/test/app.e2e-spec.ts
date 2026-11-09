import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { createTestApp, registerUser, type TestSession } from './helpers.js';

// Needs the database from docker-compose.yml and DATABASE_URL in api/.env
describe('API (e2e)', () => {
  let app: INestApplication<App>;
  let session: TestSession;
  const api = () => request(app.getHttpServer());
  const auth = () => ({ Authorization: `Bearer ${session.accessToken}` });

  beforeAll(async () => {
    app = await createTestApp();
    session = await registerUser(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health is public', () => {
    return api()
      .get('/api/health')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'));
  });

  it('rejects requests without a token', async () => {
    const res = await api().get('/api/exercises').expect(401);
    expect(res.body).toMatchObject({ errorCode: 'missing_credentials' });
    expect(typeof res.body.error).toBe('string');
  });

  it('POST /api/exercises validates and normalizes', async () => {
    await api()
      .post('/api/exercises')
      .set(auth())
      .send({ name: '   ', category: 'strength' })
      .expect(400)
      .expect({ error: 'Name is required' });

    const created = await api()
      .post('/api/exercises')
      .set(auth())
      .send({
        name: '  E2E Curl  ',
        category: ' Strength ',
        muscleGroup: '',
        bogus: 'stripped',
      })
      .expect(201);

    expect(created.body).toMatchObject({
      name: 'E2E Curl',
      category: 'strength',
      muscleGroup: null,
    });
    expect(created.body).not.toHaveProperty('bogus');

    await api()
      .put(`/api/exercises/${created.body.id}`)
      .set(auth())
      .send({ name: '' })
      .expect(400)
      .expect({ error: 'Name cannot be empty' });

    await api()
      .delete(`/api/exercises/${created.body.id}`)
      .set(auth())
      .expect(204);

    await api()
      .get(`/api/exercises/${created.body.id}`)
      .set(auth())
      .expect(404)
      .expect({ error: 'Exercise not found' });
  });

  it('GET /api/workouts only returns the signed-in user’s workouts', async () => {
    // A fresh account has none, even though the demo user has some.
    const res = await api().get('/api/workouts').set(auth()).expect(200);
    expect(res.body).toEqual([]);
  });
});
