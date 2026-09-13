import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff, scopedBranchId } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'

export async function GET(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    const staff = await requireStaff(request, PERMISSIONS.ORDERS_READ)
    const branchId = scopedBranchId(staff, request.nextUrl.searchParams.get('branchId'))
    const { orderNumber } = await params
    const order = await db.order.findFirst({
      where: {
        orderNumber,
        ...(branchId ? { items: { some: { variant: { inventory: { some: { branchId } } } } } } : {}),
      },
      select: {
        orderNumber: true, status: true, paymentStatus: true, paymentMethod: true,
        codVerificationStatus: true, customerName: true, customerMobile: true, customerEmail: true,
        shippingAddressSnapshot: true, subtotal: true, discountTotal: true, shippingTotal: true,
        taxTotal: true, grandTotal: true, createdAt: true, updatedAt: true,
        items: { select: { productNameSnapshot: true, variantNameSnapshot: true, skuSnapshot: true, quantity: true, unitPrice: true, lineTotal: true } },
        payments: { orderBy: { createdAt: 'desc' }, take: 5, select: { providerCode: true, providerPaymentId: true, status: true, amount: true, currency: true, createdAt: true } },
        shipments: { orderBy: { createdAt: 'desc' }, take: 5, select: { status: true, awb: true, trackingUrl: true, providerCode: true, createdAt: true } },
      },
    })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json({
      order: {
        ...order,
        subtotal: Number(order.subtotal), discountTotal: Number(order.discountTotal), shippingTotal: Number(order.shippingTotal),
        taxTotal: Number(order.taxTotal), grandTotal: Number(order.grandTotal),
        items: order.items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice), lineTotal: Number(item.lineTotal) })),
        payments: order.payments.map((payment) => ({ ...payment, amount: Number(payment.amount) })),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied' || message === 'Branch access denied' || message === 'Branch assignment required') return NextResponse.json({ error: message }, { status: 403 })
    return NextResponse.json({ error: 'Unable to load order' }, { status: 503 })
  }
}
