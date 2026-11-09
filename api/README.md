# Fitness API (NestJS + PostgreSQL)

NestJS 12 (ESM), Prisma 7 with the `pg` driver adapter, PostgreSQL 17 in Docker.

## First-time setup

```bash
cd api
npm install                      # if npm 10 fails with "edgesOut", use: npx npm@11 install
# create api/.env with DATABASE_URL, PORT and JWT_SECRET (see "Environment" below)
npm run db:up                    # starts Postgres from ../docker-compose.yml (host port 5433)
npm run db:generate              # generates the Prisma client into src/generated/prisma
npm run db:migrate               # applies migrations
npm run seed                     # 15 exercises + demo user with 2 workouts
npm run start:dev
```

- API: http://localhost:3001/api
- Swagger UI: http://localhost:3001/api/docs
- OpenAPI spec (for the Flutter client generator): http://localhost:3001/api/openapi.json

## Environment

```
DATABASE_URL="postgresql://fitness:fitness@localhost:5433/fitness?schema=public"
PORT=3001
JWT_SECRET="<at least 32 random bytes: openssl rand -base64 32>"
```

## Auth

`@nestjs/authentication`: email + password, JWT access tokens (15 min) and
rotating refresh tokens (30 days, 90 days max per sign-in) stored hashed in
Postgres (`src/auth/prisma-refresh-token.store.ts`). Reusing a spent refresh
token revokes that whole sign-in.

- A global guard protects every route; mark open ones with `@Public()`.
- Get the user with `@CurrentUser()` / `@CurrentUser('id')`.
- `POST /api/auth/register`, `POST /api/auth/token` (sign in),
  `POST /api/auth/token/refresh`, `POST /api/auth/logout`, `GET /api/auth/me`.
- Dev account from `npm run seed`: `demo@fitness.local` / `demo-password`.
- In Swagger UI, click **Authorize** and paste an `accessToken`.

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
