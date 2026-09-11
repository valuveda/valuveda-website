import { db } from '@/src/lib/db'
import {
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_TTL_SECONDS,
  generateOtp,
  hashOtp,
  normalizeIndianMobile,
  verifyOtpHash,
} from '@/src/lib/otp-policy'

export type OtpDelivery = {
  send(mobile: string, otp: string): Promise<void>
}

class ConfiguredOtpDelivery implements OtpDelivery {
  async send(_mobile: string, _otp: string) {
    const provider = process.env.OTP_DELIVERY_PROVIDER
    if (!provider) throw new Error('OTP delivery is not configured')
    throw new Error(`OTP delivery provider ${provider} is not configured`)
  }
}

export const otpDelivery: OtpDelivery = new ConfiguredOtpDelivery()

type OtpChallengeRow = {
  id: string
  otp_hash: string
  expires_at: Date
  attempts: number
  last_sent_at: Date
}

export async function requestMobileOtp(mobileInput: string, now = new Date()) {
  const mobile = normalizeIndianMobile(mobileInput)
  const existing = await db.$queryRaw<OtpChallengeRow[]>`
    SELECT id, otp_hash, expires_at, attempts, last_sent_at
    FROM otp_challenges
    WHERE mobile = ${mobile}
      AND verified_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `
  const current = existing[0]
  if (current && now.getTime() - current.last_sent_at.getTime() < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
    throw new Error('Please wait before requesting another OTP')
  }

  const otp = generateOtp()
  const otpHash = hashOtp(otp)
  const expiresAt = new Date(now.getTime() + OTP_TTL_SECONDS * 1000)

  await db.$transaction(async (tx) => {
    await tx.$executeRaw`
      UPDATE otp_challenges
      SET verified_at = ${now}
      WHERE mobile = ${mobile}
        AND verified_at IS NULL
    `
    await tx.$executeRaw`
      INSERT INTO otp_challenges (mobile, otp_hash, expires_at, attempts, last_sent_at)
      VALUES (${mobile}, ${otpHash}, ${expiresAt}, 0, ${now})
    `
  })

  try {
    await otpDelivery.send(mobile, otp)
  } catch (error) {
    await db.$executeRaw`
      UPDATE otp_challenges
      SET verified_at = ${now}
      WHERE mobile = ${mobile}
        AND otp_hash = ${otpHash}
        AND verified_at IS NULL
    `
    throw error
  }

  return { mobile, expiresInSeconds: OTP_TTL_SECONDS }
}

export async function verifyMobileOtp(mobileInput: string, otp: string, now = new Date()) {
  const mobile = normalizeIndianMobile(mobileInput)
  if (!/^\d{6}$/.test(otp)) throw new Error('Invalid OTP')

  const result = await db.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<OtpChallengeRow[]>`
      SELECT id, otp_hash, expires_at, attempts, last_sent_at
      FROM otp_challenges
      WHERE mobile = ${mobile}
        AND verified_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1
      FOR UPDATE
    `
    const challenge = rows[0]
    if (!challenge || challenge.expires_at.getTime() <= now.getTime()) throw new Error('OTP expired')
    if (challenge.attempts >= OTP_MAX_ATTEMPTS) throw new Error('OTP attempt limit reached')

    const valid = verifyOtpHash(otp, challenge.otp_hash)
    if (!valid) {
      await tx.$executeRaw`
        UPDATE otp_challenges SET attempts = attempts + 1 WHERE id = ${challenge.id}::uuid
      `
      throw new Error('Invalid OTP')
    }

    await tx.$executeRaw`
      UPDATE otp_challenges SET verified_at = ${now} WHERE id = ${challenge.id}::uuid
    `

    const customers = await tx.$queryRaw<{ id: string }[]>`
      SELECT id FROM customers WHERE mobile = ${mobile} LIMIT 1
    `
    let customerId = customers[0]?.id
    if (!customerId) {
      const created = await tx.$queryRaw<{ id: string }[]>`
        INSERT INTO customers (mobile, mobile_verified_at, status, created_at, updated_at)
        VALUES (${mobile}, ${now}, 'ACTIVE', ${now}, ${now})
        RETURNING id
      `
      customerId = created[0].id
    } else {
      await tx.$executeRaw`
        UPDATE customers SET mobile_verified_at = ${now}, updated_at = ${now} WHERE id = ${customerId}::uuid
      `
    }
    return customerId
  })

  return { customerId: result }
}
