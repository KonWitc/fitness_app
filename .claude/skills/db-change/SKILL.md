---
name: db-change
description: Safely change the Prisma schema (add/rename/remove fields or models) and keep server routes and client types in sync. Use when the user asks to modify a database model or field.
argument-hint: <description of the schema change>
---

# Database change: $ARGUMENTS

1. Edit `server/prisma/schema.prisma`, then `cd server && npx prisma format && npx prisma validate`.
2. Apply: `npx prisma migrate dev --name <short_snake_case_description>` (this also regenerates the client).
   - If Prisma warns about data loss or asks to reset, **stop and ask the user** — never run `migrate reset` or `db push --accept-data-loss` on your own.
   - Adding a required field to a table with rows needs a `@default(...)` or a two-step change; prefer making it optional first.
3. Find every usage of the changed model/field:
   - `server/src/routes/*.ts` (validation, `create`/`update` data, filters)
   - `server/prisma/seed.ts`
   - `client/src/services/*.ts` interfaces and input types
   - `client/src/features/**` components that render or edit the field
4. Update them all, then run the `/verify` skill.
