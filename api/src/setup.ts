import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpErrorFilter } from './common/http-error.filter.js';

/** Shared by main.ts and the e2e tests, so both run the same app. */
export function configureApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpErrorFilter());
  app.enableShutdownHooks();

  // Swagger UI at /api/docs, spec at /api/openapi.json (used to generate the Dart client)
  SwaggerModule.setup('api/docs', app, () => createOpenApiDocument(app), {
    jsonDocumentUrl: 'api/openapi.json',
  });
}

export function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Fitness API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  // Operation ids become method names in the generated Dart client
  // (ExercisesClient.findAll), so drop the default "ExercisesController_" prefix.
  return SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
  });
}
