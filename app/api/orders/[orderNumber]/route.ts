import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const mobile = request.nextUrl.searchParams.get('mobile')?.replace(/\D/g, '') ?? ''
  if (!/^\d{10}$/.test(mobile)) return NextResponse.json({ error: 'Mobile verification is required' }, { status: 400 })

  try {
    const order = await db.order.findFirst({
      where: { orderNumber, customerMobile: { endsWith: mobile } },
      select: {
        orderNumber: true, status: true, paymentStatus: true, paymentMethod: true,
        subtotal: true, discountTotal: true, shippingTotal: true, taxTotal: true, grandTotal: true,
        placedAt: true, deliveredAt: true,
        items: { select: { productNameSnapshot: true, variantNameSnapshot: true, skuSnapshot: true, quantity: true, unitPrice: true, lineTotal: true } },
        shipments: { select: { status: true, awb: true, trackingUrl: true, trackingEvents: { select: { status: true, providerStatus: true, occurredAt: true }, orderBy: { occurredAt: 'desc' } } } },
      },
    })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    return NextResponse.json({
      ...order,
      subtotal: Number(order.subtotal), discountTotal: Number(order.discountTotal), shippingTotal: Number(order.shippingTotal),
      taxTotal: Number(order.taxTotal), grandTotal: Number(order.grandTotal),
      items: order.items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice), lineTotal: Number(item.lineTotal) })),
    })
  } catch {
    return NextResponse.json({ error: 'Order service temporarily unavailable' }, { status: 503 })
  }
}
