import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { COOKIE_NAME, readCustomerSession } from '@/src/lib/customer-session'

export async function GET(request: NextRequest) {
  const session = readCustomerSession(request.cookies.get(COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ customer: null }, { status: 401 })

  const customer = await db.customer.findUnique({
    where: { id: session.customerId },
    select: { id: true, mobile: true, email: true, mobileVerifiedAt: true, emailVerifiedAt: true, status: true },
  })
  if (!customer || customer.status !== 'ACTIVE') return NextResponse.json({ customer: null }, { status: 401 })

  return NextResponse.json({ customer })
}
