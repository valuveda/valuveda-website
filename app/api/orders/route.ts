import { NextRequest, NextResponse } from 'next/server'
import { PaymentMethod } from '@prisma/client'
import { createCheckoutOrder } from '@/src/lib/checkout/order-create'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const paymentMethod = body.paymentMethod === 'COD' ? PaymentMethod.COD : body.paymentMethod === 'ONLINE' ? PaymentMethod.ONLINE : null
    if (!paymentMethod || !Array.isArray(body.items) || !body.shippingAddress || typeof body.customerName !== 'string' || typeof body.customerMobile !== 'string') {
      return NextResponse.json({ error: 'Invalid checkout request' }, { status: 400 })
    }

    if ('isFirstTimeCustomer' in body || 'shippingTotal' in body || 'taxTotal' in body || (body.coupon && typeof body.coupon !== 'string')) {
      return NextResponse.json({ error: 'Invalid client pricing fields' }, { status: 400 })
    }

    const result = await createCheckoutOrder({
      items: body.items,
      customerId: typeof body.customerId === 'string' ? body.customerId : undefined,
      customerName: body.customerName,
      customerMobile: body.customerMobile,
      customerEmail: typeof body.customerEmail === 'string' ? body.customerEmail : undefined,
      shippingAddress: body.shippingAddress,
      paymentMethod,
      couponCode: typeof body.coupon === 'string' ? body.coupon : undefined,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const clientErrors = new Set([
      'Cart is empty',
      'Customer details are required',
      'Invalid mobile number',
      'Invalid quantity',
      'One or more products are unavailable',
      'Customer identity could not be verified',
      'Coupon code is required',
      'Invalid or inactive coupon',
      'Coupon is not active yet',
      'Coupon has expired',
      'Coupon rule is disabled',
      'Coupon usage limit reached',
      'You have reached this coupon limit',
      'Coupon is valid only for first-time customers',
      'Coupon cannot be combined with other discounts',
      'Coupon has no applicable discount',
    ])
    if (clientErrors.has(message) || message.startsWith('Minimum ') || message.startsWith('Maximum ')) {
      return NextResponse.json({ error: message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Unable to create order' }, { status: 503 })
  }
}
