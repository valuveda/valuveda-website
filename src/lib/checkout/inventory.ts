import { Prisma } from '@prisma/client'

export async function reserveInventory(tx: Prisma.TransactionClient, items: Array<{ variantId: string; quantity: number }>, orderId: string) {
  for (const item of items) {
    const updated = await tx.$executeRaw`
      WITH candidate AS (
        SELECT id
        FROM inventory
        WHERE variant_id = ${item.variantId}::uuid
          AND quantity - reserved >= ${item.quantity}
        ORDER BY branch_id NULLS LAST, id
        LIMIT 1
        FOR UPDATE
      )
      UPDATE inventory AS i
      SET reserved = i.reserved + ${item.quantity}, updated_at = NOW()
      FROM candidate
      WHERE i.id = candidate.id
    `
    if (updated !== 1) throw new Error('Insufficient inventory')
    const variant = await tx.productVariant.findUnique({ where: { id: item.variantId }, select: { productId: true } })
    if (!variant) throw new Error('Product variant not found')
    await tx.inventoryMovement.create({ data: { productId: variant.productId, variantId: item.variantId, type: 'RESERVATION', quantity: item.quantity, referenceType: 'ORDER', referenceId: orderId, note: 'Checkout inventory reservation' } })
  }
}

export async function releaseInventory(tx: Prisma.TransactionClient, orderId: string) {
  const items = await tx.orderItem.findMany({ where: { orderId }, select: { productId: true, variantId: true, quantity: true } })
  for (const item of items) {
    const released = await tx.$executeRaw`
      WITH candidate AS (
        SELECT id
        FROM inventory
        WHERE variant_id = ${item.variantId}::uuid
          AND reserved >= ${item.quantity}
        ORDER BY branch_id NULLS LAST, id
        LIMIT 1
        FOR UPDATE
      )
      UPDATE inventory AS i
      SET reserved = GREATEST(0, i.reserved - ${item.quantity}), updated_at = NOW()
      FROM candidate
      WHERE i.id = candidate.id
    `
    if (released !== 1) throw new Error('Inventory reservation could not be released')
    await tx.inventoryMovement.create({ data: { productId: item.productId, variantId: item.variantId, type: 'RELEASE', quantity: item.quantity, referenceType: 'ORDER', referenceId: orderId, note: 'Order reservation released' } })
  }
}
