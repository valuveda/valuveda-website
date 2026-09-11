import { db } from '@/src/lib/db'

export type CouponValidation = {
  couponId: string
  code: string
  amount: number
  type: 'FIXED' | 'PERCENTAGE'
  stackable: boolean
}

export async function validateCoupon(input: {
  code: string
  subtotal: number
  quantity: number
  customerId?: string
  isFirstTimeCustomer: boolean
  now?: Date
}): Promise<CouponValidation> {
  const code = input.code.trim().toUpperCase()
  if (!code) throw new Error('Coupon code is required')

  const coupon = await db.coupon.findUnique({
    where: { code },
    include: { discountRule: true },
  })
  if (!coupon || coupon.status !== 'ACTIVE') throw new Error('Invalid or inactive coupon')

  const now = input.now ?? new Date()
  const startsAt = coupon.startsAt ?? coupon.discountRule.startsAt
  const endsAt = coupon.endsAt ?? coupon.discountRule.endsAt
  if (startsAt && now < startsAt) throw new Error('Coupon is not active yet')
  if (endsAt && now > endsAt) throw new Error('Coupon has expired')
  if (!coupon.discountRule.enabled) throw new Error('Coupon rule is disabled')

  const minOrderValue = Math.max(
    Number(coupon.minOrderValue ?? 0),
    Number(coupon.discountRule.minOrderValue ?? 0),
  )
  if (input.subtotal < minOrderValue) throw new Error(`Minimum order value is ₹${minOrderValue}`)

  const minQuantity = coupon.discountRule.minQuantity
  const maxQuantity = coupon.discountRule.maxQuantity
  if (minQuantity !== null && input.quantity < minQuantity) throw new Error(`Minimum quantity is ${minQuantity}`)
  if (maxQuantity !== null && input.quantity > maxQuantity) throw new Error(`Maximum quantity is ${maxQuantity}`)

  if ((coupon.discountRule.firstTimeOnly || coupon.discountRule.kind === 'FIRST_TIME_CUSTOMER') && !input.isFirstTimeCustomer) {
    throw new Error('Coupon is valid only for first-time customers')
  }

  const totalUses = await db.couponRedemption.count({ where: { couponId: coupon.id } })
  if (coupon.maxUses !== null && totalUses >= coupon.maxUses) throw new Error('Coupon usage limit reached')

  if (input.customerId && coupon.maxUsesPerCustomer !== null) {
    const customerUses = await db.couponRedemption.count({ where: { couponId: coupon.id, customerId: input.customerId } })
    if (customerUses >= coupon.maxUsesPerCustomer) throw new Error('You have reached this coupon limit')
  }

  const rawAmount = Number(coupon.discountRule.amount)
  const amount = coupon.discountRule.type === 'PERCENTAGE'
    ? Math.min(input.subtotal, input.subtotal * rawAmount / 100)
    : Math.min(input.subtotal, rawAmount)

  if (amount <= 0) throw new Error('Coupon has no applicable discount')

  return {
    couponId: coupon.id,
    code: coupon.code,
    amount: Math.round(amount * 100) / 100,
    type: coupon.discountRule.type,
    stackable: coupon.discountRule.stackable,
  }
}
