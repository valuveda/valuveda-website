import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff, scopedBranchId } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'
import { canTransitionOrderStatus } from '@/src/lib/order-status'
import type { OrderStatus } from '@prisma/client'

const ORDER_STATUSES = new Set<OrderStatus>(['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'CANCELLED', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED'])

export async function PATCH(request: NextRequest) {
  try {
    const staff = await requireStaff(request, PERMISSIONS.ORDERS_WRITE)
    const body = await request.json().catch(() => null)
    const orderNumber = typeof body?.orderNumber === 'string' ? body.orderNumber.trim() : ''
    const nextStatus = typeof body?.status === 'string' ? body.status.toUpperCase() as OrderStatus : null
    if (!orderNumber || !nextStatus || !ORDER_STATUSES.has(nextStatus)) {
      return NextResponse.json({ error: 'Valid orderNumber and status are required' }, { status: 400 })
    }

    const branchId = scopedBranchId(staff, typeof body?.branchId === 'string' ? body.branchId : null)
    const result = await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { orderNumber },
        select: { id: true, orderNumber: true, status: true, items: { select: { variant: { select: { inventory: { select: { branchId: true } } } } } } },
      })
      if (!order) throw new Error('Order not found')
      if (branchId && !order.items.some((item) => item.variant.inventory.some((inventory) => inventory.branchId === branchId))) throw new Error('Branch access denied')
      if (order.status === nextStatus) return { order, changed: false }
      if (!canTransitionOrderStatus(order.status, nextStatus)) throw new Error(`Invalid order status transition: ${order.status} -> ${nextStatus}`)

      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          status: nextStatus,
          ...(nextStatus === 'CANCELLED' ? { cancelledAt: new Date() } : {}),
          ...(nextStatus === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
        },
        select: { id: true, orderNumber: true, status: true, cancelledAt: true, deliveredAt: true },
      })
      await tx.auditLog.create({
        data: {
          staffUserId: staff.id,
          action: 'ORDER_STATUS_UPDATED',
          entityType: 'ORDER',
          entityId: order.id,
          metadata: { orderNumber, from: order.status, to: nextStatus },
          ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      })
      return { order: updated, changed: true }
    })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied' || message === 'Branch access denied' || message === 'Branch assignment required') return NextResponse.json({ error: message }, { status: 403 })
    if (message === 'Order not found') return NextResponse.json({ error: message }, { status: 404 })
    if (message.startsWith('Invalid order status transition')) return NextResponse.json({ error: message }, { status: 409 })
    return NextResponse.json({ error: 'Unable to update order status' }, { status: 503 })
  }
}
