import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'valuveda_staff_session'
const MAX_AGE_SECONDS = 60 * 60 * 8

type StaffSessionPayload = { staffUserId: string; exp: number }

function secret() {
  const value = process.env.STAFF_SESSION_SECRET
  if (!value || value.length < 32) throw new Error('STAFF_SESSION_SECRET is not configured')
  return value
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

export function createStaffSession(staffUserId: string, now = Math.floor(Date.now() / 1000)) {
  const payload: StaffSessionPayload = { staffUserId, exp: now + MAX_AGE_SECONDS }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${sign(encoded)}`
}

export function readStaffSession(value: string | undefined, now = Math.floor(Date.now() / 1000)): StaffSessionPayload | null {
  if (!value) return null
  const [encoded, signature] = value.split('.')
  if (!encoded || !signature) return null
  const expected = Buffer.from(sign(encoded))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as StaffSessionPayload
    if (!payload.staffUserId || !Number.isInteger(payload.exp) || payload.exp <= now) return null
    return payload
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

export { COOKIE_NAME }
