import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './setup.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const port = app.get(ConfigService).get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api (docs: /api/docs)`);
}
await bootstrap();
