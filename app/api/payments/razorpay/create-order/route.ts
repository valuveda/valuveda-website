import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { COOKIE_NAME, readCustomerSession } from '@/src/lib/customer-session'
import { getPaymentProvider } from '@/src/lib/integrations/payment'

export async function POST(request: NextRequest) {
  const session = readCustomerSession(request.cookies.get(COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  try {
    const body = await request.json().catch(() => ({}))
    const orderNumber = typeof body.orderNumber === 'string' ? body.orderNumber.trim() : ''
    if (!orderNumber) return NextResponse.json({ error: 'Order number is required' }, { status: 400 })

    const order = await db.order.findFirst({
      where: { orderNumber, customerId: session.customerId, paymentMethod: 'ONLINE' },
      select: {
        id: true,
        orderNumber: true,
        grandTotal: true,
        currency: true,
        status: true,
        paymentStatus: true,
        customerName: true,
        customerMobile: true,
        customerEmail: true,
        payments: {
          where: { method: 'ONLINE' },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, providerCode: true, providerOrderId: true, amount: true, currency: true, status: true },
        },
      },
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.status === 'CANCELLED') return NextResponse.json({ error: 'Order is cancelled' }, { status: 409 })
    if (order.paymentStatus === 'PAID') return NextResponse.json({ error: 'Order is already paid' }, { status: 409 })

    const payment = order.payments[0]
    if (!payment) return NextResponse.json({ error: 'Payment record not found' }, { status: 409 })
    if (payment.providerOrderId) {
      return NextResponse.json({
        provider: payment.providerCode,
        providerOrderId: payment.providerOrderId,
        amount: Number(payment.amount),
        currency: payment.currency,
      })
    }

    const provider = getPaymentProvider('ONLINE')
    const created = await provider.createOrder({
      orderNumber: order.orderNumber,
      amount: Number(payment.amount),
      currency: payment.currency,
      customer: { name: order.customerName, mobile: order.customerMobile, email: order.customerEmail },
    })

    if (created.amount !== Number(payment.amount) || created.currency !== payment.currency) {
      return NextResponse.json({ error: 'Payment amount validation failed' }, { status: 502 })
    }

    const claimed = await db.payment.updateMany({
      where: { id: payment.id, providerOrderId: null, status: 'PENDING' },
      data: { providerCode: created.providerCode, providerOrderId: created.providerOrderId },
    })

    if (claimed.count === 0) {
      const latest = await db.payment.findUnique({ where: { id: payment.id }, select: { providerCode: true, providerOrderId: true, amount: true, currency: true } })
      if (!latest?.providerOrderId) return NextResponse.json({ error: 'Unable to initialize payment' }, { status: 409 })
      return NextResponse.json({ provider: latest.providerCode, providerOrderId: latest.providerOrderId, amount: Number(latest.amount), currency: latest.currency })
    }

    return NextResponse.json({ provider: created.providerCode, providerOrderId: created.providerOrderId, amount: created.amount, currency: created.currency })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Razorpay is not configured') return NextResponse.json({ error: 'Online payment is not configured' }, { status: 503 })
    return NextResponse.json({ error: 'Unable to initialize payment' }, { status: 502 })
  }
}
