CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "countries" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "country_name" TEXT NOT NULL,
  CONSTRAINT "pk_notification" PRIMARY KEY ("id")
);
