import { NextRequest, NextResponse } from 'next/server'
import type { ShipmentStatus } from '@prisma/client'
import { db } from '@/src/lib/db'
import { requireStaff, scopedBranchId } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'

const STATUSES = new Set<ShipmentStatus>(['NOT_CREATED', 'CREATED', 'AWB_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY', 'RETURNED', 'CANCELLED'])
const transitions: Record<ShipmentStatus, readonly ShipmentStatus[]> = {
  NOT_CREATED: ['CREATED', 'CANCELLED'], CREATED: ['AWB_ASSIGNED', 'PICKED_UP', 'CANCELLED'], AWB_ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'RETURNED'], IN_TRANSIT: ['OUT_FOR_DELIVERY', 'RETURNED', 'FAILED_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED_DELIVERY', 'RETURNED'], DELIVERED: [], FAILED_DELIVERY: ['OUT_FOR_DELIVERY', 'RETURNED'], RETURNED: [], CANCELLED: [],
}

export async function PATCH(request: NextRequest) {
  try {
    const staff = await requireStaff(request, PERMISSIONS.SHIPPING_WRITE)
    const body = await request.json().catch(() => null)
    const orderNumber = typeof body?.orderNumber === 'string' ? body.orderNumber.trim() : ''
    const nextStatus = typeof body?.status === 'string' ? body.status.toUpperCase() as ShipmentStatus : null
    const awb = typeof body?.awb === 'string' ? body.awb.trim() || null : null
    const trackingUrl = typeof body?.trackingUrl === 'string' ? body.trackingUrl.trim() || null : null
    if (!orderNumber || !nextStatus || !STATUSES.has(nextStatus)) return NextResponse.json({ error: 'Valid orderNumber and shipment status are required' }, { status: 400 })
    const branchId = scopedBranchId(staff, typeof body?.branchId === 'string' ? body.branchId : null)

    const result = await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { orderNumber },
        select: { id: true, items: { select: { variant: { select: { inventory: { select: { branchId: true } } } } } }, shipments: { orderBy: { createdAt: 'desc' }, take: 1, select: { id: true, status: true } } },
      })
      if (!order) throw new Error('Order not found')

      const fulfillmentRows = await tx.$queryRaw<Array<{ fulfillment_branch_id: string | null }>>`
        SELECT fulfillment_branch_id::text AS fulfillment_branch_id
        FROM orders
        WHERE id = ${order.id}::uuid
        LIMIT 1
      `
      const fulfillmentBranchId = fulfillmentRows[0]?.fulfillment_branch_id ?? null
      if (branchId && fulfillmentBranchId
        ? fulfillmentBranchId !== branchId
        : branchId && !order.items.some((item) => item.variant.inventory.some((inventory) => inventory.branchId === branchId))) {
        throw new Error('Branch access denied')
      }

      const shipment = order.shipments[0]
      if (!shipment) throw new Error('Shipment not created')
      if (shipment.status !== nextStatus && !transitions[shipment.status].includes(nextStatus)) throw new Error(`Invalid shipment status transition: ${shipment.status} -> ${nextStatus}`)
      const updated = await tx.shipment.update({ where: { id: shipment.id }, data: { status: nextStatus, awb, trackingUrl, ...(nextStatus === 'PICKED_UP' ? { pickedUpAt: new Date() } : {}), ...(nextStatus === 'DELIVERED' ? { deliveredAt: new Date() } : {}) }, select: { id: true, status: true, awb: true, trackingUrl: true } })
      await tx.auditLog.create({ data: { staffUserId: staff.id, action: 'SHIPMENT_UPDATED', entityType: 'SHIPMENT', entityId: shipment.id, metadata: { orderNumber, from: shipment.status, to: nextStatus, awb, trackingUrl } } })
      return updated
    })
    return NextResponse.json({ shipment: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied' || message === 'Branch access denied' || message === 'Branch assignment required') return NextResponse.json({ error: message }, { status: 403 })
    if (message === 'Order not found') return NextResponse.json({ error: message }, { status: 404 })
    if (message === 'Shipment not created' || message.startsWith('Invalid shipment status transition')) return NextResponse.json({ error: message }, { status: 409 })
    return NextResponse.json({ error: 'Unable to update shipment' }, { status: 503 })
  }
}
