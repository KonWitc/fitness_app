# Fitness API (NestJS + PostgreSQL)

NestJS 12 (ESM), Prisma 7 with the `pg` driver adapter, PostgreSQL 17 in Docker.

## First-time setup

```bash
cd api
npm install                      # if npm 10 fails with "edgesOut", use: npx npm@11 install
# create api/.env (see .env.example)
npm run db:up                    # starts Postgres from ../docker-compose.yml (host port 5433)
npm run db:generate              # generates the Prisma client into src/generated/prisma
npm run db:migrate               # applies migrations
npm run seed                     # 15 exercises + demo user with 2 workouts
npm run start:dev
```

- API: http://localhost:3001/api
- Swagger UI: http://localhost:3001/api/docs
- OpenAPI spec (for the Flutter client generator): http://localhost:3001/api/openapi.json

## Checks

```bash
npm run typecheck
npm run lint
npm test                         # unit
npm run test:e2e                 # needs the database running
```

## Conventions

- One module per resource in `src/<resource>/`: controller, service, `dto/`, `*.entity.ts` (response shape for Swagger).
- Validation via `class-validator` DTOs; normalization (trim / lowercase / empty → `null`) via helpers in `src/common/transforms.ts`.
- All errors are `{ "error": string }` (see `src/common/http-error.filter.ts`).
- Throw Nest exceptions (`NotFoundException`, ...) from services; no try/catch boilerplate in controllers.
- Import Prisma types from `src/generated/prisma/client.js`; relative imports end in `.js` (ESM).
