import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'

export const CART_COOKIE = 'vv_cart_session'
export const CART_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export function createCartSessionKey(): string {
  return randomBytes(32).toString('hex')
}

export async function getCartSessionKey(): Promise<string | null> {
  return (await cookies()).get(CART_COOKIE)?.value ?? null
}

export async function setCartSessionCookie(value: string) {
  ;(await cookies()).set(CART_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: CART_MAX_AGE_SECONDS,
  })
}
