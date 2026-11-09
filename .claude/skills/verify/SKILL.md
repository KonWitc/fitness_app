---
name: verify
description: Typecheck, lint and build both client and server to confirm changes compile. Use after finishing any code change, before saying work is done, or when the user asks to check/verify the project.
---

# Verify the project

Run each check and collect results — don't stop at the first failure.

```bash
cd server && npx prisma validate && npx tsc --noEmit
cd server && npm run lint
cd client && npm run build
cd client && npm run lint
```

Then report a short table: check → pass/fail, with the relevant error lines for any failure.

- Fix errors that come from the current change.
- For pre-existing failures unrelated to the change (e.g. ESLint config problems noted in CLAUDE.md), report them but don't fix them unless asked.
