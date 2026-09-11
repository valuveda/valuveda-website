import { NextResponse } from 'next/server'
import { clearStaffSessionCookie } from '@/src/lib/staff-auth'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.headers.append('Set-Cookie', clearStaffSessionCookie())
  return response
}
