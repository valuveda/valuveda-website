import { db } from '@/src/lib/db'
import { createOrderNumber } from '@/src/lib/order-number'
import { calculatePricing } from '@/src/lib/pricing'
import { PaymentMethod } from '@prisma/client'

export type CreateOrderInput = {
  items: Array<{ variantId: string; quantity: number }>
  customerId?: string
  customerName: string
  customerMobile: string
  customerEmail?: string
  shippingAddress: Record<string, unknown>
  paymentMethod: PaymentMethod
  shippingTotal?: number
  taxTotal?: number
  coupon?: { code: string; amount: number } | null
  isFirstTimeCustomer?: boolean
}

export async function createCheckoutOrder(input: CreateOrderInput) {
  if (!input.items.length) throw new Error('Cart is empty')
  if (!input.customerName.trim() || !input.customerMobile.trim()) throw new Error('Customer details are required')

  const quantities = new Map<string, number>()
  for (const item of input.items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) throw new Error('Invalid quantity')
    quantities.set(item.variantId, (quantities.get(item.variantId) ?? 0) + item.quantity)
  }

  const variants = await db.productVariant.findMany({
    where: { id: { in: [...quantities.keys()] }, isActive: true, product: { status: 'ACTIVE' } },
    include: { product: true },
  })
  if (variants.length !== quantities.size) throw new Error('One or more products are unavailable')

  const lines = variants.map((variant) => {
    const quantity = quantities.get(variant.id)!
    return {
      quantity,
      unitPrice: Number(variant.sellingPrice),
      mrp: Number(variant.mrp),
      lineTotal: Number(variant.sellingPrice) * quantity,
    }
  })

  const pricing = calculatePricing({
    lines,
    isFirstTimeCustomer: Boolean(input.isFirstTimeCustomer),
    coupon: input.coupon,
    shippingTotal: input.shippingTotal,
    taxTotal: input.taxTotal,
  })

  const orderNumber = createOrderNumber()
  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        customerId: input.customerId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: input.paymentMethod,
        codVerificationStatus: input.paymentMethod === PaymentMethod.COD ? 'PENDING' : 'NOT_REQUIRED',
        currency: 'INR',
        subtotal: pricing.subtotal,
        discountTotal: pricing.discountTotal,
        shippingTotal: pricing.shippingTotal,
        taxTotal: pricing.taxTotal,
        grandTotal: pricing.grandTotal,
        customerName: input.customerName.trim(),
        customerMobile: input.customerMobile.trim(),
        customerEmail: input.customerEmail?.trim() || null,
        shippingAddressSnapshot: input.shippingAddress,
        items: {
          create: variants.map((variant) => {
            const quantity = quantities.get(variant.id)!
            const lineTotal = Number(variant.sellingPrice) * quantity
            return {
              productId: variant.productId,
              variantId: variant.id,
              productNameSnapshot: variant.product.name,
              variantNameSnapshot: variant.name,
              skuSnapshot: variant.sku,
              quantity,
              unitMrp: variant.mrp,
              unitPrice: variant.sellingPrice,
              lineTotal,
            }
          }),
        },
        discounts: {
          create: pricing.discounts.map((discount) => ({
            code: discount.code,
            name: discount.name,
            type: 'FIXED',
            amount: discount.amount,
          })),
        },
        payments: {
          create: {
            providerCode: input.paymentMethod === PaymentMethod.COD ? 'cod' : 'razorpay',
            method: input.paymentMethod,
            status: 'PENDING',
            amount: pricing.grandTotal,
            currency: 'INR',
          },
        },
      },
      select: { id: true, orderNumber: true, status: true, paymentStatus: true, grandTotal: true },
    })

    return created
  })

  return {
    ...order,
    grandTotal: Number(order.grandTotal),
  }
}
