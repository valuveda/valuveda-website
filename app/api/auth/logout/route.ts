import { NextResponse } from 'next/server'
import { clearCustomerSessionCookie } from '@/src/lib/customer-session'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.headers.append('Set-Cookie', clearCustomerSessionCookie())
  return response
}
