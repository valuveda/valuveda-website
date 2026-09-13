import { Prisma } from '@prisma/client'

export async function reserveInventory(tx: Prisma.TransactionClient, items: Array<{ variantId: string; quantity: number }>, orderId: string) {
  let fulfillmentBranchId: string | null = null

  for (const item of items) {
    const rows = fulfillmentBranchId
      ? await tx.$queryRaw<Array<{ branch_id: string }>>`
          WITH candidate AS (
            SELECT id
            FROM inventory
            WHERE variant_id = ${item.variantId}::uuid
              AND branch_id = ${fulfillmentBranchId}::uuid
              AND quantity - reserved >= ${item.quantity}
            ORDER BY id
            LIMIT 1
            FOR UPDATE
          )
          UPDATE inventory AS i
          SET reserved = i.reserved + ${item.quantity}, updated_at = NOW()
          FROM candidate
          WHERE i.id = candidate.id
          RETURNING i.branch_id::text AS branch_id
        `
      : await tx.$queryRaw<Array<{ branch_id: string }>>`
          WITH candidate AS (
            SELECT id
            FROM inventory
            WHERE variant_id = ${item.variantId}::uuid
              AND quantity - reserved >= ${item.quantity}
            ORDER BY branch_id, id
            LIMIT 1
            FOR UPDATE
          )
          UPDATE inventory AS i
          SET reserved = i.reserved + ${item.quantity}, updated_at = NOW()
          FROM candidate
          WHERE i.id = candidate.id
          RETURNING i.branch_id::text AS branch_id
        `

    const branchId = rows[0]?.branch_id
    if (!branchId) throw new Error('Insufficient inventory in a single fulfillment branch')
    fulfillmentBranchId ??= branchId

    const variant = await tx.productVariant.findUnique({ where: { id: item.variantId }, select: { productId: true } })
    if (!variant) throw new Error('Product variant not found')
    await tx.inventoryMovement.create({
      data: {
        productId: variant.productId,
        variantId: item.variantId,
        type: 'RESERVATION',
        quantity: item.quantity,
        referenceType: 'ORDER',
        referenceId: orderId,
        note: `Checkout inventory reservation · branch ${fulfillmentBranchId}`,
      },
    })
  }

  return fulfillmentBranchId
}

export async function releaseInventory(tx: Prisma.TransactionClient, orderId: string) {
  const items = await tx.orderItem.findMany({ where: { orderId }, select: { productId: true, variantId: true, quantity: true } })
  const branchRows = await tx.$queryRaw<Array<{ fulfillment_branch_id: string | null }>>`
    SELECT fulfillment_branch_id::text AS fulfillment_branch_id
    FROM orders
    WHERE id = ${orderId}::uuid
    LIMIT 1
  `
  const fulfillmentBranchId = branchRows[0]?.fulfillment_branch_id ?? null

  for (const item of items) {
    const released = fulfillmentBranchId
      ? await tx.$executeRaw`
          WITH candidate AS (
            SELECT id
            FROM inventory
            WHERE variant_id = ${item.variantId}::uuid
              AND branch_id = ${fulfillmentBranchId}::uuid
              AND reserved >= ${item.quantity}
            ORDER BY id
            LIMIT 1
            FOR UPDATE
          )
          UPDATE inventory AS i
          SET reserved = GREATEST(0, i.reserved - ${item.quantity}), updated_at = NOW()
          FROM candidate
          WHERE i.id = candidate.id
        `
      : await tx.$executeRaw`
          WITH candidate AS (
            SELECT id
            FROM inventory
            WHERE variant_id = ${item.variantId}::uuid
              AND reserved >= ${item.quantity}
            ORDER BY branch_id, id
            LIMIT 1
            FOR UPDATE
          )
          UPDATE inventory AS i
          SET reserved = GREATEST(0, i.reserved - ${item.quantity}), updated_at = NOW()
          FROM candidate
          WHERE i.id = candidate.id
        `
    if (released !== 1) throw new Error('Inventory reservation could not be released')
    await tx.inventoryMovement.create({
      data: {
        productId: item.productId,
        variantId: item.variantId,
        type: 'RELEASE',
        quantity: item.quantity,
        referenceType: 'ORDER',
        referenceId: orderId,
        note: `Order reservation released${fulfillmentBranchId ? ` · branch ${fulfillmentBranchId}` : ''}`,
      },
    })
  }
}
