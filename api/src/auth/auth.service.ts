import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthSessionEntity } from './auth.entities.js';
import { authUserSelect, type AuthUser } from './auth.types.js';
import type { RegisterDto } from './dto/auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService
  ) {}

  async register({
    email,
    password,
    name,
  }: RegisterDto): Promise<AuthSessionEntity> {
    const passwordHash = await this.hasher.hash(password);
    try {
      const user = await this.prisma.user.create({
        data: { email, passwordHash, name: name ?? null },
        select: authUserSelect,
      });
      return this.startSession(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An account with this email already exists'
        );
      }
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<AuthSessionEntity> {
    const found = await this.prisma.user.findUnique({ where: { email } });
    // verify() also runs for unknown emails (against a dummy hash), so the
    // response time does not reveal which accounts exist.
    const ok = await this.verify(password, found?.passwordHash);
    if (!found || !ok) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (this.hasher.needsRehash(found.passwordHash)) {
      await this.prisma.user.update({
        where: { id: found.id },
        data: { passwordHash: await this.hasher.hash(password) },
      });
    }
    return this.startSession({
      id: found.id,
      email: found.email,
      name: found.name,
    });
  }

  private async verify(password: string, hash: string | undefined) {
    try {
      return await this.hasher.verify(password, hash);
    } catch {
      return false; // a malformed stored value (e.g. pre-auth placeholder)
    }
  }

  private async startSession(user: AuthUser): Promise<AuthSessionEntity> {
    const tokens = await this.tokens.issue(user.id, {
      method: 'password',
      claims: { amr: ['pwd'] },
    });
    return { ...tokens, user };
  }
}
