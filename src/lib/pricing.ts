export type PricingLine = {
  quantity: number
  unitPrice: number
  mrp: number
  lineTotal: number
}

export type DiscountCandidate = {
  code: string
  name: string
  amount: number
  reason: 'FIRST_TIME_CUSTOMER' | 'QUANTITY_PACK' | 'COUPON'
}

export type PricingInput = {
  lines: PricingLine[]
  isFirstTimeCustomer: boolean
  coupon?: { code: string; amount: number } | null
  shippingTotal?: number
  taxTotal?: number
}

export type PricingResult = {
  subtotal: number
  discountTotal: number
  shippingTotal: number
  taxTotal: number
  grandTotal: number
  discounts: DiscountCandidate[]
}

const PACK_DISCOUNTS: Record<number, number> = { 2: 250, 3: 500 }

/** Pure checkout pricing. Persisted DiscountRule/Coupon records remain the source of truth once DB-backed rules are enabled. */
export function calculatePricing(input: PricingInput): PricingResult {
  const subtotal = round(input.lines.reduce((sum, line) => sum + line.lineTotal, 0))
  const quantity = input.lines.reduce((sum, line) => sum + line.quantity, 0)
  const discounts: DiscountCandidate[] = []

  if (input.isFirstTimeCustomer) {
    discounts.push({ code: 'FIRST_ORDER', name: 'First order discount', amount: 100, reason: 'FIRST_TIME_CUSTOMER' })
  }

  const packDiscount = PACK_DISCOUNTS[quantity]
  if (packDiscount) {
    discounts.push({ code: `PACK_${quantity}`, name: `Pack of ${quantity} discount`, amount: packDiscount, reason: 'QUANTITY_PACK' })
  }

  if (input.coupon && input.coupon.amount > 0) {
    discounts.push({ code: input.coupon.code, name: 'Coupon discount', amount: input.coupon.amount, reason: 'COUPON' })
  }

  // Rules are mutually additive only at the domain layer; the admin-configured rules should
  // decide eligibility/stacking before calling this function. Never let discounts exceed subtotal.
  const discountTotal = Math.min(subtotal, round(discounts.reduce((sum, item) => sum + item.amount, 0)))
  const shippingTotal = round(input.shippingTotal ?? 0)
  const taxTotal = round(input.taxTotal ?? 0)
  const grandTotal = Math.max(0, round(subtotal - discountTotal + shippingTotal + taxTotal))

  return { subtotal, discountTotal, shippingTotal, taxTotal, grandTotal, discounts }
}

function round(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
