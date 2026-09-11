import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    await requireStaff(request, PERMISSIONS.CUSTOMERS_READ)
    const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit') ?? 25), 1), 100)
    const customers = await db.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true, mobile: true, email: true, status: true, mobileVerifiedAt: true, emailVerifiedAt: true, createdAt: true,
        profile: { select: { firstName: true, lastName: true } },
        _count: { select: { orders: true, couponRedemptions: true } },
      },
    })
    return NextResponse.json({
      customers: customers.map((customer) => ({ ...customer, ordersCount: customer._count.orders, couponRedemptionsCount: customer._count.couponRedemptions })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied') return NextResponse.json({ error: message }, { status: 403 })
    return NextResponse.json({ error: 'Unable to load customers' }, { status: 503 })
  }
}
