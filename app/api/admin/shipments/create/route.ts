import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff, scopedBranchId } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'
import { resolveShippingProvider } from '@/src/lib/integrations/shipping-providers'
import type { ShipmentCreateInput } from '@/src/lib/integrations/shipping'

export async function POST(request: NextRequest) {
  try {
    const staff = await requireStaff(request, PERMISSIONS.SHIPPING_WRITE)
    const body = await request.json().catch(() => ({}))
    const orderNumber = typeof body.orderNumber === 'string' ? body.orderNumber.trim() : ''
    const requestedProvider = typeof body.providerCode === 'string' ? body.providerCode.trim().toLowerCase() : ''
    if (!orderNumber) return NextResponse.json({ error: 'orderNumber is required' }, { status: 400 })

    const order = await db.order.findUnique({
      where: { orderNumber },
      include: {
        items: { select: { productNameSnapshot: true, skuSnapshot: true, quantity: true, unitPrice: true } },
        shipments: { orderBy: { createdAt: 'desc' }, take: 1, select: { id: true, status: true } },
      },
    })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    const branchId = scopedBranchId(staff, typeof body.branchId === 'string' ? body.branchId : null)

    if (branchId) {
      const fulfillmentRows = await db.$queryRaw<Array<{ fulfillment_branch_id: string | null }>>\`
        SELECT fulfillment_branch_id::text AS fulfillment_branch_id FROM orders WHERE id = ${order.id}::uuid LIMIT 1
      \`
      const fulfillmentBranchId = fulfillmentRows[0]?.fulfillment_branch_id ?? null
      if (fulfillmentBranchId && fulfillmentBranchId !== branchId) return NextResponse.json({ error: 'Branch access denied' }, { status: 403 })
    }

    if (order.shipments[0] && order.shipments[0].status !== 'NOT_CREATED') {
      return NextResponse.json({ error: 'Shipment already exists for this order' }, { status: 409 })
    }

    const providerRecord = requestedProvider
      ? await db.shippingProvider.findUnique({ where: { code: requestedProvider } })
      : await db.shippingProvider.findFirst({ where: { status: 'ENABLED' }, orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }] })
    if (!providerRecord || providerRecord.status !== 'ENABLED') {
      return NextResponse.json({ error: 'No enabled shipping provider is configured' }, { status: 409 })
    }

    const address = order.shippingAddressSnapshot as Record<string, unknown>
    const input: ShipmentCreateInput = {
      orderNumber: order.orderNumber,
      customer: { name: order.customerName, mobile: order.customerMobile, email: order.customerEmail },
      address: {
        line1: String(address.line1 ?? ''),
        line2: address.line2 ? String(address.line2) : null,
        city: String(address.city ?? ''),
        state: String(address.state ?? ''),
        postalCode: String(address.postalCode ?? ''),
        country: String(address.country ?? 'IN'),
      },
      items: order.items.map((item) => ({ name: item.productNameSnapshot, sku: item.skuSnapshot, quantity: item.quantity, unitPrice: Number(item.unitPrice) })),
      paymentMethod: order.paymentMethod,
      amount: Number(order.grandTotal),
    }

    const result = await resolveShippingProvider(providerRecord.code).createShipment(input)
    const shipment = await db.$transaction(async (tx) => {
      const created = await tx.shipment.create({
        data: {
          orderId: order.id,
          shippingProviderId: providerRecord.id,
          externalShipmentId: result.externalShipmentId,
          externalOrderId: result.externalOrderId,
          awb: result.awb,
          trackingUrl: result.trackingUrl,
          labelUrl: result.labelUrl,
          status: result.awb ? 'AWB_ASSIGNED' : 'CREATED',
          providerStatus: result.awb ? 'AWB_ASSIGNED' : 'CREATED',
        },
        select: { id: true, status: true, awb: true, trackingUrl: true, labelUrl: true, externalShipmentId: true, shippingProviderId: true },
      })
      await tx.auditLog.create({ data: { staffUserId: staff.id, action: 'SHIPMENT_CREATED', entityType: 'SHIPMENT', entityId: created.id, metadata: { orderNumber, providerCode: providerRecord.code, externalShipmentId: result.externalShipmentId, awb: result.awb ?? null } } })
      return created
    })
    return NextResponse.json({ shipment }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied' || message === 'Branch access denied' || message === 'Branch assignment required') return NextResponse.json({ error: message }, { status: 403 })
    if (message.includes('credentials are not configured') || message.includes('not configured')) return NextResponse.json({ error: message }, { status: 503 })
    return NextResponse.json({ error: 'Unable to create shipment' }, { status: 503 })
  }
}
