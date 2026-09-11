import { db } from '@/src/lib/db'
import { releaseInventory } from '@/src/lib/checkout/inventory'
import { normalizeIndianMobile } from '@/src/lib/otp-policy'

const CANCELLABLE = new Set(['PENDING', 'CONFIRMED', 'PROCESSING'])

type OrderOwner = { customerId?: string; mobile?: string }

export async function cancelOrder(orderNumber: string, owner: OrderOwner) {
  const normalizedMobile = owner.mobile ? normalizeIndianMobile(owner.mobile) : undefined
  if (!owner.customerId && !normalizedMobile) throw new Error('Order ownership verification is required')

  return db.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        orderNumber,
        ...(owner.customerId ? { customerId: owner.customerId } : { customerMobile: normalizedMobile }),
      },
      select: { id: true, status: true },
    })
    if (!order) throw new Error('Order not found')
    if (!CANCELLABLE.has(order.status)) throw new Error('Order cannot be cancelled')

    await releaseInventory(tx, order.id)

    return tx.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
      select: { orderNumber: true, status: true, cancelledAt: true },
    })
  })
}
