CREATE TABLE "UserPreference" (
  "id" TEXT NOT NULL,
  "clerkUserId" TEXT NOT NULL,
  "defaultPersona" TEXT NOT NULL DEFAULT 'insightful',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Generation" (
  "id" TEXT NOT NULL,
  "clerkUserId" TEXT NOT NULL,
  "tweetUrl" VARCHAR(2000),
  "tweetText" VARCHAR(2000) NOT NULL,
  "persona" VARCHAR(32) NOT NULL,
  "reply" VARCHAR(280) NOT NULL,
  "model" VARCHAR(160) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserPreference_clerkUserId_key" ON "UserPreference"("clerkUserId");
CREATE INDEX "Generation_clerkUserId_createdAt_idx" ON "Generation"("clerkUserId", "createdAt");
