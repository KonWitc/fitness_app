import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/setup.js';

// Needs the database from docker-compose.yml and DATABASE_URL in api/.env
describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'));
  });

  it('POST /api/exercises validates and normalizes', async () => {
    await request(app.getHttpServer())
      .post('/api/exercises')
      .send({ name: '   ', category: 'strength' })
      .expect(400)
      .expect({ error: 'Name is required' });

    const created = await request(app.getHttpServer())
      .post('/api/exercises')
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

    await request(app.getHttpServer())
      .put(`/api/exercises/${created.body.id}`)
      .send({ name: '' })
      .expect(400)
      .expect({ error: 'Name cannot be empty' });

    await request(app.getHttpServer())
      .delete(`/api/exercises/${created.body.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/api/exercises/${created.body.id}`)
      .expect(404)
      .expect({ error: 'Exercise not found' });
  });
});
