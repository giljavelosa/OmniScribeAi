-- Trial and billing config: Subscription trial fields, PriceConfig, DiscountCode, BillingConfig, free plan.

-- Add 'free' to PlanCode enum (before starter for logical order; PostgreSQL adds at end)
ALTER TYPE "PlanCode" ADD VALUE IF NOT EXISTS 'free';

-- Add trial and post-trial columns to Subscription
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "trialPlanCode" "PlanCode";
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "trialEndedAt" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "postTrialDiscountPercent" INTEGER;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "postTrialDiscountMonths" INTEGER;

-- Create PriceConfig table
CREATE TABLE IF NOT EXISTS "PriceConfig" (
  "id" TEXT NOT NULL,
  "planCode" "PlanCode" NOT NULL,
  "billingInterval" "BillingInterval" NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PriceConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PriceConfig_planCode_billingInterval_key" ON "PriceConfig"("planCode", "billingInterval");

-- Create DiscountCode table
CREATE TABLE IF NOT EXISTS "DiscountCode" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "value" INTEGER NOT NULL,
  "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "validTo" TIMESTAMP(3),
  "maxRedemptions" INTEGER,
  "redemptionCount" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DiscountCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DiscountCode_code_key" ON "DiscountCode"("code");
CREATE INDEX IF NOT EXISTS "DiscountCode_code_validFrom_validTo_idx" ON "DiscountCode"("code", "validFrom", "validTo");

-- Create BillingConfig table
CREATE TABLE IF NOT EXISTS "BillingConfig" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "BillingConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BillingConfig_key_key" ON "BillingConfig"("key");

-- Seed default monthly prices (amountCents: 4900=$49, 7900=$79, 14900=$149)
INSERT INTO "PriceConfig" ("id", "planCode", "billingInterval", "amountCents", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'starter', 'monthly', 4900, NOW(), NOW()),
  (gen_random_uuid()::text, 'professional', 'monthly', 7900, NOW(), NOW()),
  (gen_random_uuid()::text, 'practice', 'monthly', 14900, NOW(), NOW())
ON CONFLICT ("planCode", "billingInterval") DO NOTHING;

-- Seed default BillingConfig
INSERT INTO "BillingConfig" ("id", "key", "value", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'annual_discount_percent', '17', NOW()),
  (gen_random_uuid()::text, 'referral_discount_percent', '15', NOW()),
  (gen_random_uuid()::text, 'post_trial_discount_percent', '10', NOW()),
  (gen_random_uuid()::text, 'post_trial_discount_months', '3', NOW())
ON CONFLICT ("key") DO NOTHING;
