import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff, scopedBranchId } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'

const COD_STATUSES = new Set(['PENDING', 'VERIFIED', 'REJECTED', 'CUSTOMER_UNREACHABLE'])

export async function PATCH(request: NextRequest) {
  try {
    const staff = await requireStaff(request, PERMISSIONS.ORDERS_WRITE)
    const body = await request.json().catch(() => null)
    const orderNumber = typeof body?.orderNumber === 'string' ? body.orderNumber.trim() : ''
    const nextStatus = typeof body?.status === 'string' ? body.status.toUpperCase() : ''
    if (!orderNumber || !COD_STATUSES.has(nextStatus)) {
      return NextResponse.json({ error: 'Valid orderNumber and COD status are required' }, { status: 400 })
    }

    const branchId = scopedBranchId(staff, typeof body?.branchId === 'string' ? body.branchId : null)
    const result = await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { orderNumber },
        select: {
          id: true, orderNumber: true, paymentMethod: true, codVerificationStatus: true,
          items: { select: { variant: { select: { inventory: { select: { branchId: true } } } } } },
        },
      })
      if (!order) throw new Error('Order not found')
      if (order.paymentMethod !== 'COD') throw new Error('Order is not COD')
      if (branchId && !order.items.some((item) => item.variant.inventory.some((inventory) => inventory.branchId === branchId))) throw new Error('Branch access denied')

      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          codVerificationStatus: nextStatus as never,
          ...(nextStatus === 'VERIFIED' ? { status: order.codVerificationStatus === 'VERIFIED' ? undefined : 'CONFIRMED' } : {}),
          ...(nextStatus === 'REJECTED' ? { status: 'CANCELLED', cancelledAt: new Date() } : {}),
        },
        select: { orderNumber: true, status: true, paymentMethod: true, codVerificationStatus: true, cancelledAt: true },
      })
      await tx.auditLog.create({
        data: {
          staffUserId: staff.id,
          action: 'COD_VERIFICATION_UPDATED',
          entityType: 'ORDER',
          entityId: order.id,
          metadata: { orderNumber, from: order.codVerificationStatus, to: nextStatus },
          ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      })
      return updated
    })

    return NextResponse.json({ order: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied' || message === 'Branch access denied' || message === 'Branch assignment required') return NextResponse.json({ error: message }, { status: 403 })
    if (message === 'Order not found') return NextResponse.json({ error: message }, { status: 404 })
    if (message === 'Order is not COD') return NextResponse.json({ error: message }, { status: 409 })
    return NextResponse.json({ error: 'Unable to update COD verification' }, { status: 503 })
  }
}
