-- AlterTable
-- Rename instead of drop + add, so existing users keep their row.
-- Old values are not hashes; npm run seed resets the demo user's password.
ALTER TABLE "User" RENAME COLUMN "password" TO "passwordHash";

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "familyExpiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "claims" JSONB,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevokedRefreshTokenFamily" (
    "familyId" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "RevokedRefreshTokenFamily_pkey" PRIMARY KEY ("familyId")
);

-- CreateIndex
CREATE INDEX "RefreshToken_familyId_idx" ON "RefreshToken"("familyId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_familyExpiresAt_idx" ON "RefreshToken"("familyExpiresAt");

-- CreateIndex
CREATE INDEX "RevokedRefreshTokenFamily_expiresAt_idx" ON "RevokedRefreshTokenFamily"("expiresAt");

