import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get(AppController);
  });

  it('reports ok on /health', () => {
    expect(appController.health()).toMatchObject({ status: 'ok' });
  });
});
