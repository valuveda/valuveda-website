import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'valuveda_staff_session'
const MAX_AGE_SECONDS = 60 * 60 * 8

function sessionSecret() {
  const value = process.env.STAFF_SESSION_SECRET
  if (!value || value.length < 32) throw new Error('STAFF_SESSION_SECRET is not configured')
  return value
}

export function hashStaffPassword(password: string) {
  if (password.length < 12) throw new Error('Password must be at least 12 characters')
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `scrypt$${salt}$${derived}`
}

export function verifyStaffPassword(password: string, stored: string) {
  const [scheme, salt, expectedHex] = stored.split('$')
  if (scheme !== 'scrypt' || !salt || !/^[a-f0-9]{128}$/i.test(expectedHex ?? '')) return false
  const actual = scryptSync(password, salt, 64)
  const expected = Buffer.from(expectedHex, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function sign(value: string) {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url')
}

export function createStaffSession(staffUserId: string, now = Math.floor(Date.now() / 1000)) {
  const encoded = Buffer.from(JSON.stringify({ staffUserId, exp: now + MAX_AGE_SECONDS })).toString('base64url')
  return `${encoded}.${sign(encoded)}`
}

export function readStaffSession(value: string | undefined, now = Math.floor(Date.now() / 1000)) {
  if (!value) return null
  const [encoded, signature] = value.split('.')
  if (!encoded || !signature) return null
  const expected = Buffer.from(sign(encoded))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as { staffUserId?: string; exp?: number }
    if (!payload.staffUserId || !Number.isInteger(payload.exp) || payload.exp <= now) return null
    return { staffUserId: payload.staffUserId }
  } catch {
    return null
  }
}

export function staffSessionCookie(value: string) {
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE_SECONDS}`
}

export function clearStaffSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
}

export { COOKIE_NAME as STAFF_COOKIE_NAME }
