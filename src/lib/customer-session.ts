import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'valuveda_customer_session'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30

type SessionPayload = { customerId: string; exp: number }

function secret() {
  const value = process.env.CUSTOMER_SESSION_SECRET
  if (!value || value.length < 32) throw new Error('CUSTOMER_SESSION_SECRET is not configured')
  return value
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

export function createCustomerSession(customerId: string, now = Math.floor(Date.now() / 1000)) {
  const payload: SessionPayload = { customerId, exp: now + MAX_AGE_SECONDS }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${sign(encoded)}`
}

export function readCustomerSession(value: string | undefined, now = Math.floor(Date.now() / 1000)): SessionPayload | null {
  if (!value) return null
  const [encoded, signature] = value.split('.')
  if (!encoded || !signature) return null
  const expected = Buffer.from(sign(encoded))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload
    if (!payload.customerId || !Number.isInteger(payload.exp) || payload.exp <= now) return null
    return payload
  } catch {
    return null
  }
}

export function customerSessionCookie(value: string) {
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`
}

export function clearCustomerSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}

export { COOKIE_NAME }
