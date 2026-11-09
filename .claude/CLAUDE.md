# Fitness App

Full-stack fitness tracker. Two independent npm packages — there is **no root package.json**, so always run npm commands inside `client/` or `server/`.

| Package | Stack | Dev port |
|---|---|---|
| `client/` | React 19, Vite 7, TypeScript, Tailwind CSS 4, React Router 7 | 5173 |
| `server/` | Express 5, TypeScript (CommonJS), Prisma 6, SQLite | 3001 |

Vite proxies `/api/*` to `http://localhost:3001` (see `client/vite.config.ts`), so client code calls relative URLs like `/api/exercises`.

## Commands

```bash
# server
cd server
npm run dev                      # ts-node-dev with respawn
npx tsc --noEmit                 # typecheck
npm run lint                     # eslint
npx prisma migrate dev --name <change>   # after editing schema.prisma
npx prisma generate              # regenerate client only
npm run seed                     # run prisma/seed.ts

# client
cd client
npm run dev
npm run build                    # tsc -b && vite build (also the typecheck)
npm run lint
```

No test framework is set up yet. Verify changes with typecheck + lint, and for API work, hit the endpoint with `curl` while `npm run dev` is running.

## Layout

```
server/
  prisma/schema.prisma   # User, Exercise, Workout, WorkoutExercise, Goal
  prisma/seed.ts
  src/index.ts           # express app, mounts routers under /api/*
  src/lib/prisma.ts      # shared PrismaClient singleton — always import from here
  src/routes/<resource>.ts
client/src/
  App.tsx                # routes (inside <Layout />)
  components/            # shared UI (Layout, ...)
  features/<feature>/    # index.tsx = page component, plus feature-local components + utils.ts
  services/<resource>.ts # fetch wrappers + TS types for the API
  utils/                 # cross-feature helpers (themeUtils = dark mode)
```

## Conventions

**Server routes** (follow `server/src/routes/exercises.ts`):
- One `Router` per resource, default export, mounted in `src/index.ts` as `app.use('/api/<resource>', router)`.
- Every handler is `async`, wrapped in `try/catch`; on failure `console.error(...)` and respond `500 { error: '...' }`.
- Errors are always JSON `{ error: string }`. Use 400 for validation, 404 for missing, 201 on create, 204 on delete.
- Validate `req.body` by hand (type + trim checks); normalize strings (`trim()`, lowercase for `category`/`muscleGroup`), empty optional strings → `null`.
- Use the `paramId(req)` helper for `req.params.id` (Express 5 types it as `string | string[]`).
- Use `Prisma.*WhereInput` / generated types instead of `any`.

**Client**:
- All HTTP goes through `src/services/<resource>.ts`; components never call `fetch` directly.
- Service functions throw `Error(data.error || 'fallback')` on non-OK responses; components catch and show the message.
- API dates arrive as ISO strings — type them as `string` in service interfaces.
- Keep the service interface in sync with the Prisma model by hand (no shared types package).
- Styling: Tailwind utility classes, always with `dark:` variants (dark mode is class-based via `utils/themeUtils.ts`).
- Function components + hooks only; default-export the page component from `features/<feature>/index.tsx`.

**Formatting**: Prettier, single quotes, semicolons, trailing commas. A hook in `.claude/settings.json` runs Prettier on files after they're edited.

## Gotchas

- `server/prisma/migrations/` and `*.db` are gitignored — the DB is local only. If the schema is out of sync, `npx prisma migrate dev` (never `migrate reset` without asking; it wipes data).
- `DATABASE_URL` lives in `server/.env` (template: `server/.env.example`). Don't read or print `.env`.
- `Workout.userId` is required but there's no auth yet — routes currently take `userId` from the request.
- Prettier config is the root `.prettierrc` (shared by both packages) and runs through ESLint (`prettier/prettier` rule) — `npm run lint -- --fix` fixes formatting. `endOfLine: auto` because git uses `autocrlf=true` on Windows.
- Both packages use ESLint 9 flat config (`eslint.config.js` / `eslint.config.mjs`). Client also enforces React Compiler hook rules such as `react-hooks/set-state-in-effect`.
- Prisma migrations in `server/prisma/migrations/` are committed — always commit new migration folders with the schema change.
- `@prisma/client` is in server `devDependencies`; it needs to move to `dependencies` before any production deploy.
