import { NextRequest, NextResponse } from 'next/server'
import { cancelOrder } from '@/src/lib/orders/cancel-order'
import { COOKIE_NAME, readCustomerSession } from '@/src/lib/customer-session'
import { normalizeIndianMobile } from '@/src/lib/otp-policy'

export async function POST(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const session = readCustomerSession(request.cookies.get(COOKIE_NAME)?.value)

  try {
    if (session) {
      const result = await cancelOrder(orderNumber, { customerId: session.customerId })
      return NextResponse.json(result)
    }

    const mobileInput = request.nextUrl.searchParams.get('mobile') ?? ''
    const mobile = normalizeIndianMobile(mobileInput)
    const result = await cancelOrder(orderNumber, { mobile })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Invalid mobile number' || message === 'Order ownership verification is required') {
      return NextResponse.json({ error: 'Mobile verification is required' }, { status: 400 })
    }
    if (message === 'Order not found') return NextResponse.json({ error: message }, { status: 404 })
    if (message === 'Order cannot be cancelled') return NextResponse.json({ error: message }, { status: 409 })
    return NextResponse.json({ error: 'Unable to cancel order' }, { status: 503 })
  }
}
