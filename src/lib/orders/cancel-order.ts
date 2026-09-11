import { db } from '@/src/lib/db'
import { releaseInventory } from '@/src/lib/checkout/inventory'
import { normalizeIndianMobile } from '@/src/lib/otp-policy'

const CANCELLABLE = new Set(['PENDING', 'CONFIRMED', 'PROCESSING'])

export async function cancelOrder(orderNumber: string, mobile: string) {
  const normalizedMobile = normalizeIndianMobile(mobile)

  return db.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { orderNumber, customerMobile: normalizedMobile },
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
