---
name: add-resource
description: Add a new full-stack resource or feature end to end (Prisma model → migration → Express router → client service → feature page → route). Use when the user asks to add a new entity, API endpoint set, or page backed by the database, e.g. "add goals", "add workout logging".
argument-hint: <resource name, e.g. goals>
---

# Add a full-stack resource: $ARGUMENTS

Work through these steps in order. Mirror the existing `exercises` resource — read it first rather than inventing new patterns.

1. **Read the reference implementation**
   - `server/src/routes/exercises.ts`
   - `client/src/services/exercises.ts`
   - `client/src/features/exercises/` (index.tsx, form, card, utils)

2. **Schema** — `server/prisma/schema.prisma`
   - Add or update the model (uuid `id`, `createdAt`, `updatedAt @updatedAt`). Add `@@index` on foreign keys.
   - `cd server && npx prisma format && npx prisma migrate dev --name add_<resource>`

3. **Router** — `server/src/routes/<resource>.ts`
   - GET list (with query filters), GET `/:id`, POST, PUT `/:id`, DELETE `/:id` — only the ones the feature needs.
   - Same validation, normalization, status codes and `{ error }` shape as exercises.
   - Mount in `server/src/index.ts`: `app.use('/api/<resource>', router)`.

4. **Seed (optional)** — add sample rows to `server/prisma/seed.ts` if useful for the UI.

5. **Client service** — `client/src/services/<resource>.ts`
   - Interface matching the Prisma model (dates as `string`), `Create…Input`, `Update…Input`, one function per endpoint.

6. **Feature UI** — `client/src/features/<resource>/index.tsx` (+ local components)
   - Loading / error / empty states, Tailwind with `dark:` variants.
   - Register the route in `client/src/App.tsx` and add a nav link in `components/Layout.tsx` if appropriate.

7. **Verify** — run the `/verify` skill, then with `npm run dev` running in `server/`, `curl` each new endpoint (happy path + a 400 + a 404).

Report what was added and anything left unfinished.
