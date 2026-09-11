import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    await requireStaff(request, PERMISSIONS.ORDERS_READ)
    const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit') ?? 25), 1), 100)
    const status = request.nextUrl.searchParams.get('status') || undefined

    const orders = await db.order.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        orderNumber: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        codVerificationStatus: true,
        customerName: true,
        customerMobile: true,
        subtotal: true,
        discountTotal: true,
        shippingTotal: true,
        taxTotal: true,
        grandTotal: true,
        createdAt: true,
        items: { select: { productNameSnapshot: true, quantity: true, lineTotal: true } },
        shipments: { select: { status: true, awb: true, trackingUrl: true }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
    })

    return NextResponse.json({
      orders: orders.map((order) => ({
        ...order,
        subtotal: Number(order.subtotal),
        discountTotal: Number(order.discountTotal),
        shippingTotal: Number(order.shippingTotal),
        taxTotal: Number(order.taxTotal),
        grandTotal: Number(order.grandTotal),
        items: order.items.map((item) => ({ ...item, lineTotal: Number(item.lineTotal) })),
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied') return NextResponse.json({ error: message }, { status: 403 })
    return NextResponse.json({ error: 'Unable to load orders' }, { status: 503 })
  }
}
