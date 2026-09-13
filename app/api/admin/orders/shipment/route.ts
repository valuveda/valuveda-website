import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff, scopedBranchId } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'
import type { ShipmentStatus } from '@prisma/client'

const STATUSES = new Set<ShipmentStatus>(['NOT_CREATED', 'CREATED', 'AWB_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY', 'RETURNED', 'CANCELLED'])

export async function PATCH(request: NextRequest) {
  try {
    const staff = await requireStaff(request, PERMISSIONS.SHIPPING_WRITE)
    const body = await request.json().catch(() => null)
    const orderNumber = typeof body?.orderNumber === 'string' ? body.orderNumber.trim() : ''
    const status = typeof body?.status === 'string' ? body.status.toUpperCase() as ShipmentStatus : null
    if (!orderNumber || !status || !STATUSES.has(status)) return NextResponse.json({ error: 'Valid orderNumber and shipment status are required' }, { status: 400 })
    const branchId = scopedBranchId(staff, typeof body?.branchId === 'string' ? body.branchId : null)

    const shipment = await db.shipment.findFirst({
      where: { order: { orderNumber } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true, order: { select: { id: true, orderNumber: true, items: { select: { variant: { select: { inventory: { select: { branchId: true } } } } } } } } },
    })
    if (!shipment) return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    if (branchId && !shipment.order.items.some((item) => item.variant.inventory.some((inventory) => inventory.branchId === branchId))) return NextResponse.json({ error: 'Branch access denied' }, { status: 403 })

    const data: { status: ShipmentStatus; awb?: string | null; trackingUrl?: string | null; providerStatus?: string | null; pickedUpAt?: Date; deliveredAt?: Date } = { status }
    if (typeof body?.awb === 'string') data.awb = body.awb.trim() || null
    if (typeof body?.trackingUrl === 'string') data.trackingUrl = body.trackingUrl.trim() || null
    if (typeof body?.providerStatus === 'string') data.providerStatus = body.providerStatus.trim() || null
    if (status === 'PICKED_UP') data.pickedUpAt = new Date()
    if (status === 'DELIVERED') data.deliveredAt = new Date()

    const updated = await db.$transaction(async (tx) => {
      const result = await tx.shipment.update({ where: { id: shipment.id }, data, select: { id: true, status: true, awb: true, trackingUrl: true, providerStatus: true, pickedUpAt: true, deliveredAt: true } })
      await tx.auditLog.create({ data: { staffUserId: staff.id, action: 'SHIPMENT_UPDATED', entityType: 'SHIPMENT', entityId: shipment.id, metadata: { orderNumber, from: shipment.status, to: status, awb: data.awb ?? undefined }, ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip'), userAgent: request.headers.get('user-agent') } })
      return result
    })
    return NextResponse.json({ shipment: updated })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied' || message === 'Branch access denied' || message === 'Branch assignment required') return NextResponse.json({ error: message }, { status: 403 })
    return NextResponse.json({ error: 'Unable to update shipment' }, { status: 503 })
  }
}
