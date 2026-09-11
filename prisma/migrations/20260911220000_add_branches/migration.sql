CREATE TABLE "branches" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "address" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "branches_code_key" ON "branches"("code");

ALTER TABLE "staff_users" ADD COLUMN "branch_id" UUID;
ALTER TABLE "inventory" ADD COLUMN "branch_id" UUID;

DROP INDEX IF EXISTS "inventory_variant_id_key";
CREATE UNIQUE INDEX "inventory_branch_id_variant_id_key" ON "inventory"("branch_id", "variant_id");
CREATE INDEX "inventory_branch_id_idx" ON "inventory"("branch_id");

ALTER TABLE "staff_users"
  ADD CONSTRAINT "staff_users_branch_id_fkey"
  FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "inventory"
  ADD CONSTRAINT "inventory_branch_id_fkey"
  FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
