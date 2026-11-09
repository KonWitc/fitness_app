import type { Prisma } from '../generated/prisma/client.js';

/** The user as the app sees it once signed in: never the password hash. */
export const authUserSelect = {
  id: true,
  email: true,
  name: true,
} satisfies Prisma.UserSelect;

export type AuthUser = Prisma.UserGetPayload<{ select: typeof authUserSelect }>;

// Types `@CurrentUser()` and `AuthenticationContext.user` app-wide.
declare module '@nestjs/authentication' {
  interface AuthenticationTypes {
    user: AuthUser;
  }
}
