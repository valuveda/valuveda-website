import { createHash, randomInt, timingSafeEqual } from 'node:crypto'

export const OTP_TTL_SECONDS = 300
export const OTP_MAX_ATTEMPTS = 5
export const OTP_RESEND_COOLDOWN_SECONDS = 30

export function normalizeIndianMobile(value: string): string {
  const digits = value.replace(/\D/g, '')
  const normalized = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits
  if (!/^[6-9]\d{9}$/.test(normalized)) throw new Error('Invalid mobile number')
  return `+91${normalized}`
}

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function hashOtp(otp: string, secret = process.env.OTP_SECRET): string {
  if (!secret) throw new Error('OTP_SECRET is not configured')
  return createHash('sha256').update(`${secret}:${otp}`).digest('hex')
}

export function verifyOtpHash(otp: string, expectedHash: string, secret = process.env.OTP_SECRET): boolean {
  if (!secret || !/^\d{6}$/.test(otp) || !/^[a-f0-9]{64}$/.test(expectedHash)) return false
  const actual = Buffer.from(hashOtp(otp, secret), 'hex')
  const expected = Buffer.from(expectedHash, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
