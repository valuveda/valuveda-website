export type CheckoutLine = {
  variantId: string
  quantity: number
  unitPrice: number
}

export type CheckoutInput = {
  lines: CheckoutLine[]
  customerId?: string
  firstTimeCustomer?: boolean
  couponAmount?: number
  shippingAmount?: number
  taxAmount?: number
}

export type CheckoutQuote = {
  subtotal: number
  discountTotal: number
  shippingTotal: number
  taxTotal: number
  grandTotal: number
}

/** Pure checkout calculation. Persist/order creation must happen server-side. */
export function quoteCheckout(input: CheckoutInput): CheckoutQuote {
  if (!input.lines.length) throw new Error("Cart is empty")
  if (input.lines.some((line) => !Number.isInteger(line.quantity) || line.quantity < 1)) {
    throw new Error("Invalid cart quantity")
  }

  const subtotal = round(input.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0))
  const quantity = input.lines.reduce((sum, line) => sum + line.quantity, 0)

  // Business defaults; the database-backed discount engine can override these later.
  let discountTotal = 0
  if (input.firstTimeCustomer) discountTotal = 100
  if (quantity >= 3) discountTotal = Math.max(discountTotal, 500)
  else if (quantity >= 2) discountTotal = Math.max(discountTotal, 250)
  discountTotal = Math.min(discountTotal, subtotal)

  const couponAmount = Math.max(0, input.couponAmount ?? 0)
  discountTotal = Math.min(subtotal, discountTotal + couponAmount)
  const shippingTotal = Math.max(0, input.shippingAmount ?? 0)
  const taxTotal = Math.max(0, input.taxAmount ?? 0)
  const grandTotal = round(Math.max(0, subtotal - discountTotal + shippingTotal + taxTotal))

  return { subtotal, discountTotal: round(discountTotal), shippingTotal, taxTotal, grandTotal }
}

function round(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
