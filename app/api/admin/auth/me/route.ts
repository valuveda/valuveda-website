import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { readStaffSession, STAFF_COOKIE_NAME } from '@/src/lib/staff-auth'

export async function GET(request: NextRequest) {
  const session = readStaffSession(request.cookies.get(STAFF_COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ staff: null }, { status: 401 })

  const staff = await db.staffUser.findUnique({
    where: { id: session.staffUserId },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      roles: { select: { role: { select: { id: true, name: true, description: true } } } },
    },
  })
  if (!staff || staff.status !== 'ACTIVE') return NextResponse.json({ staff: null }, { status: 401 })

  return NextResponse.json({ staff })
}
