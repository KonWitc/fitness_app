import { Injectable, Optional } from '@nestjs/common';
import {
  AuthenticationStorage,
  type RefreshTokenRecord,
  type RefreshTokenStore,
} from '@nestjs/authentication';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

/**
 * Refresh tokens in PostgreSQL. Follows the `RefreshTokenStore` contract
 * (checked by `authenticationStoreContract()` in test/auth-store.e2e-spec.ts):
 * - `markRefreshTokenUsed()` is a single conditional UPDATE, which is what
 *   detects a stolen (reused) token;
 * - revocations live in their own table, so they also cover tokens of the
 *   family saved after the revocation;
 * - optional fields come back `undefined`, never `null`.
 */
@Injectable()
export class PrismaRefreshTokenStore implements RefreshTokenStore {
  constructor(
    private readonly prisma: PrismaService,
    // Absent in the contract tests, which call the store directly.
    @Optional() storage?: AuthenticationStorage
  ) {
    storage?.registerSource({ refreshTokens: this });
  }

  async getRefreshToken(id: string): Promise<RefreshTokenRecord | undefined> {
    const row = await this.prisma.refreshToken.findUnique({ where: { id } });
    if (!row) return undefined;
    return {
      id: row.id,
      familyId: row.familyId,
      userId: row.userId,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      familyExpiresAt: row.familyExpiresAt,
      ...(row.usedAt && { usedAt: row.usedAt }),
      ...(row.claims != null && {
        claims: row.claims as Record<string, unknown>,
      }),
    };
  }

  async saveRefreshToken(record: RefreshTokenRecord): Promise<void> {
    // `createdAt` is TokenService's clock: also the cutoff for cleanup, so the
    // tables stay bounded without a scheduled job.
    const now = record.createdAt;
    await this.prisma.$transaction([
      this.prisma.refreshToken.deleteMany({
        where: { familyExpiresAt: { lt: now } },
      }),
      this.prisma.revokedRefreshTokenFamily.deleteMany({
        where: { expiresAt: { lt: now } },
      }),
      this.prisma.refreshToken.create({
        data: {
          id: record.id,
          familyId: record.familyId,
          userId: record.userId,
          createdAt: record.createdAt,
          expiresAt: record.expiresAt,
          familyExpiresAt: record.familyExpiresAt,
          usedAt: record.usedAt ?? null,
          claims: (record.claims as Prisma.InputJsonObject) ?? Prisma.DbNull,
        },
      }),
    ]);
  }

  async markRefreshTokenUsed(id: string, at: Date): Promise<boolean> {
    // UPDATE ... WHERE id = ? AND "usedAt" IS NULL: of concurrent calls, one wins.
    const { count } = await this.prisma.refreshToken.updateMany({
      where: { id, usedAt: null },
      data: { usedAt: at },
    });
    return count === 1;
  }

  async revokeRefreshTokenFamily(familyId: string): Promise<void> {
    const family = await this.prisma.refreshToken.aggregate({
      where: { familyId },
      _max: { familyExpiresAt: true },
    });
    await this.prisma.revokedRefreshTokenFamily.createMany({
      data: [{ familyId, expiresAt: family._max.familyExpiresAt }],
      skipDuplicates: true, // ON CONFLICT DO NOTHING: idempotent, race-safe
    });
  }

  async isRefreshTokenFamilyRevoked(familyId: string): Promise<boolean> {
    const revoked = await this.prisma.revokedRefreshTokenFamily.findUnique({
      where: { familyId },
      select: { familyId: true },
    });
    return revoked !== null;
  }

  async revokeUserRefreshTokens(userId: string): Promise<void> {
    const families = await this.prisma.refreshToken.groupBy({
      by: ['familyId'],
      where: { userId },
      _max: { familyExpiresAt: true },
    });
    if (families.length === 0) return;
    await this.prisma.revokedRefreshTokenFamily.createMany({
      data: families.map((f) => ({
        familyId: f.familyId,
        expiresAt: f._max.familyExpiresAt,
      })),
      skipDuplicates: true,
    });
  }
}
