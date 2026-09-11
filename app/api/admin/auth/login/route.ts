import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { createStaffSession, staffSessionCookie, verifyStaffPassword } from '@/src/lib/staff-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

    const staff = await db.staffUser.findUnique({
      where: { email },
      select: { id: true, passwordHash: true, status: true },
    })
    if (!staff || staff.status !== 'ACTIVE' || !verifyStaffPassword(password, staff.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.headers.append('Set-Cookie', staffSessionCookie(createStaffSession(staff.id)))
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'STAFF_SESSION_SECRET is not configured') {
      return NextResponse.json({ error: message }, { status: 503 })
    }
    return NextResponse.json({ error: 'Unable to sign in' }, { status: 503 })
  }
}
