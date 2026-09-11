import { db } from '@/src/lib/db'
import { createOrderNumber } from '@/src/lib/order-number'
import { calculatePricing } from '@/src/lib/pricing'
import { reserveInventory } from '@/src/lib/checkout/inventory'
import { validateCoupon } from '@/src/lib/checkout/coupon'
import { normalizeIndianMobile } from '@/src/lib/otp-policy'
import { PaymentMethod } from '@prisma/client'

export type CreateOrderInput = {
  items: Array<{ variantId: string; quantity: number }>
  customerId?: string
  customerName: string
  customerMobile: string
  customerEmail?: string
  shippingAddress: Record<string, unknown>
  paymentMethod: PaymentMethod
  couponCode?: string
}

export async function createCheckoutOrder(input: CreateOrderInput) {
  if (!input.items.length) throw new Error('Cart is empty')
  if (!input.customerName.trim() || !input.customerMobile.trim()) throw new Error('Customer details are required')

  const customerMobile = normalizeIndianMobile(input.customerMobile)
  let isFirstTimeCustomer = false

  if (input.customerId) {
    const customer = await db.customer.findUnique({
      where: { id: input.customerId },
      select: { id: true, mobile: true, orders: { select: { id: true }, take: 1 } },
    })
    if (!customer || customer.mobile !== customerMobile) throw new Error('Customer identity could not be verified')
    isFirstTimeCustomer = customer.orders.length === 0
  }

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
  const basePricing = calculatePricing({
    lines,
    isFirstTimeCustomer,
    coupon: null,
    shippingTotal: 0,
    taxTotal: 0,
  })
  const totalQuantity = [...quantities.values()].reduce((sum, value) => sum + value, 0)
  const orderNumber = createOrderNumber()

  const order = await db.$transaction(async (tx) => {
    // Coupon validation and redemption happen in the same transaction. The
    // coupon row is locked by validateCoupon before usage counts are checked.
    let coupon: Awaited<ReturnType<typeof validateCoupon>> | null = null
    if (input.couponCode) {
      coupon = await validateCoupon({
        code: input.couponCode,
        subtotal: basePricing.subtotal,
        quantity: totalQuantity,
        customerId: input.customerId,
        isFirstTimeCustomer,
        tx,
      })
      if (!coupon.stackable && basePricing.discounts.length > 0) {
        throw new Error('Coupon cannot be combined with other discounts')
      }
    }

    const pricing = calculatePricing({
      lines,
      isFirstTimeCustomer,
      coupon: coupon ? { code: coupon.code, amount: coupon.amount } : null,
      shippingTotal: 0,
      taxTotal: 0,
    })

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
        customerMobile,
        customerEmail: input.customerEmail?.trim() || null,
        shippingAddressSnapshot: input.shippingAddress,
        items: {
          create: variants.map((variant) => {
            const quantity = quantities.get(variant.id)!
            return {
              productId: variant.productId,
              variantId: variant.id,
              productNameSnapshot: variant.product.name,
              variantNameSnapshot: variant.name,
              skuSnapshot: variant.sku,
              quantity,
              unitMrp: variant.mrp,
              unitPrice: variant.sellingPrice,
              lineTotal: Number(variant.sellingPrice) * quantity,
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

    if (coupon) {
      await tx.couponRedemption.create({
        data: {
          couponId: coupon.couponId,
          customerId: input.customerId ?? null,
          orderId: created.id,
          amount: coupon.amount,
        },
      })
    }

    await reserveInventory(
      tx,
      [...quantities].map(([variantId, quantity]) => ({ variantId, quantity })),
      created.id,
    )
    return created
  })

  return { ...order, grandTotal: Number(order.grandTotal) }
}
