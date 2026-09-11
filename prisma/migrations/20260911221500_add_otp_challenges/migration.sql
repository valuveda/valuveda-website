CREATE TABLE "otp_challenges" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "mobile" TEXT NOT NULL,
  "otp_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "last_sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "verified_at" TIMESTAMP(3),
  "customer_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "otp_challenges_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "otp_challenges_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "otp_challenges_mobile_created_at_idx" ON "otp_challenges"("mobile", "created_at");
CREATE INDEX "otp_challenges_expires_at_idx" ON "otp_challenges"("expires_at");
CREATE INDEX "otp_challenges_customer_id_idx" ON "otp_challenges"("customer_id");
