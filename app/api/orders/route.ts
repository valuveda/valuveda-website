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

    if (body.coupon || body.isFirstTimeCustomer || typeof body.shippingTotal === 'number' || typeof body.taxTotal === 'number') {
      return NextResponse.json({ error: 'Client-supplied pricing fields are not accepted' }, { status: 400 })
    }

    const result = await createCheckoutOrder({
      items: body.items,
      customerId: typeof body.customerId === 'string' ? body.customerId : undefined,
      customerName: body.customerName,
      customerMobile: body.customerMobile,
      customerEmail: typeof body.customerEmail === 'string' ? body.customerEmail : undefined,
      shippingAddress: body.shippingAddress,
      paymentMethod,
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
    ])
    if (clientErrors.has(message)) return NextResponse.json({ error: message }, { status: 400 })
    return NextResponse.json({ error: 'Unable to create order' }, { status: 503 })
  }
}
