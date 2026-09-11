import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    await requireStaff(request, PERMISSIONS.COUPONS_READ)
    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        status: true,
        minOrderValue: true,
        maxUses: true,
        maxUsesPerCustomer: true,
        startsAt: true,
        endsAt: true,
        discountRule: { select: { name: true, kind: true, type: true, amount: true, enabled: true, stackable: true } },
        _count: { select: { redemptions: true } },
      },
    })

    return NextResponse.json({
      coupons: coupons.map((coupon) => ({
        ...coupon,
        minOrderValue: coupon.minOrderValue === null ? null : Number(coupon.minOrderValue),
        discountRule: { ...coupon.discountRule, amount: Number(coupon.discountRule.amount) },
        uses: coupon._count.redemptions,
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied') return NextResponse.json({ error: message }, { status: 403 })
    return NextResponse.json({ error: 'Unable to load coupons' }, { status: 503 })
  }
}
