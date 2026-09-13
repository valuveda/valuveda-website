ALTER TABLE "orders"
ADD COLUMN "fulfillment_branch_id" uuid;

ALTER TABLE "orders"
ADD CONSTRAINT "orders_fulfillment_branch_id_fkey"
FOREIGN KEY ("fulfillment_branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "orders_fulfillment_branch_id_idx" ON "orders"("fulfillment_branch_id");
