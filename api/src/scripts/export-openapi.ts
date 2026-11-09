// Writes the OpenAPI spec to ../mobile/openapi.json (input for the Dart client
// generator) without starting the HTTP server. Run with `npm run openapi`.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { configureApp, createOpenApiDocument } from '../setup.js';

const app = await NestFactory.create(AppModule, { logger: ['error'] });
configureApp(app);
await app.init();

const out = resolve(import.meta.dirname, '../../../mobile/openapi.json');
writeFileSync(out, JSON.stringify(createOpenApiDocument(app), null, 2) + '\n');
console.log(`OpenAPI spec written to ${out}`);

await app.close();
