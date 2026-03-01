-- Add visit sharing primitives for hybrid organization-level note sharing.

CREATE TYPE "VisitVisibility" AS ENUM ('private', 'organization', 'restricted');
CREATE TYPE "VisitSharePermission" AS ENUM ('view', 'comment');

ALTER TABLE "Visit"
  ADD COLUMN "organizationId" TEXT,
  ADD COLUMN "visibility" "VisitVisibility" NOT NULL DEFAULT 'private';

-- Backfill existing visits with the owner's organization when available.
UPDATE "Visit" v
SET "organizationId" = u."organizationId"
FROM "User" u
WHERE v."userId" = u."id"
  AND v."organizationId" IS NULL
  AND u."organizationId" IS NOT NULL;

ALTER TABLE "Visit"
  ADD CONSTRAINT "Visit_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "VisitShareGrant" (
  "id" TEXT NOT NULL,
  "visitId" TEXT NOT NULL,
  "granteeUserId" TEXT NOT NULL,
  "grantedByUserId" TEXT NOT NULL,
  "permission" "VisitSharePermission" NOT NULL DEFAULT 'view',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),

  CONSTRAINT "VisitShareGrant_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Visit_organizationId_idx" ON "Visit"("organizationId");
CREATE INDEX "Visit_organizationId_visibility_idx" ON "Visit"("organizationId", "visibility");
CREATE INDEX "VisitShareGrant_visitId_idx" ON "VisitShareGrant"("visitId");
CREATE INDEX "VisitShareGrant_granteeUserId_idx" ON "VisitShareGrant"("granteeUserId");
CREATE INDEX "VisitShareGrant_visitId_granteeUserId_revokedAt_idx" ON "VisitShareGrant"("visitId", "granteeUserId", "revokedAt");
CREATE UNIQUE INDEX "VisitShareGrant_visitId_granteeUserId_key" ON "VisitShareGrant"("visitId", "granteeUserId");

ALTER TABLE "VisitShareGrant"
  ADD CONSTRAINT "VisitShareGrant_visitId_fkey"
  FOREIGN KEY ("visitId") REFERENCES "Visit"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VisitShareGrant"
  ADD CONSTRAINT "VisitShareGrant_granteeUserId_fkey"
  FOREIGN KEY ("granteeUserId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VisitShareGrant"
  ADD CONSTRAINT "VisitShareGrant_grantedByUserId_fkey"
  FOREIGN KEY ("grantedByUserId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
