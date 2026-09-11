import { NextRequest, NextResponse } from 'next/server'
import { PaymentMethod, PaymentStatus } from '@prisma/client'
import { db } from '@/src/lib/db'
import { normalizeIndianMobile } from '@/src/lib/otp-policy'
import { RazorpayPaymentProvider } from '@/src/lib/integrations/razorpay'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params
  const mobileInput = request.nextUrl.searchParams.get('mobile') ?? ''

  let mobile: string
  try {
    mobile = normalizeIndianMobile(mobileInput)
  } catch {
    return NextResponse.json({ error: 'Valid mobile verification is required' }, { status: 400 })
  }

  try {
    const order = await db.order.findFirst({
      where: { orderNumber, customerMobile: mobile },
      select: {
        id: true,
        orderNumber: true,
        paymentMethod: true,
        paymentStatus: true,
        currency: true,
        grandTotal: true,
        customerName: true,
        customerMobile: true,
        customerEmail: true,
        payments: {
          where: { providerCode: 'razorpay' },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, providerOrderId: true, status: true, amount: true, currency: true },
        },
      },
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.paymentMethod !== PaymentMethod.ONLINE) {
      return NextResponse.json({ error: 'Online payment is not required for this order' }, { status: 409 })
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      return NextResponse.json({ error: 'Order is already paid' }, { status: 409 })
    }

    const existing = order.payments[0]
    if (existing?.providerOrderId) {
      return NextResponse.json({
        orderNumber: order.orderNumber,
        providerCode: 'razorpay',
        providerOrderId: existing.providerOrderId,
        amount: Number(existing.amount),
        currency: existing.currency,
      })
    }

    const provider = new RazorpayPaymentProvider()
    const created = await provider.createOrder({
      orderNumber: order.orderNumber,
      amount: Number(order.grandTotal),
      currency: order.currency,
      customer: {
        name: order.customerName,
        mobile: order.customerMobile,
        email: order.customerEmail,
      },
    })

    const payment = await db.payment.updateMany({
      where: {
        id: existing?.id,
        providerCode: 'razorpay',
        status: { not: PaymentStatus.PAID },
        providerOrderId: null,
      },
      data: { providerOrderId: created.providerOrderId },
    })

    if (payment.count !== 1) {
      const current = await db.payment.findFirst({
        where: { orderId: order.id, providerCode: 'razorpay' },
        select: { providerOrderId: true, amount: true, currency: true },
      })
      if (!current?.providerOrderId) throw new Error('Unable to attach payment provider order')
      return NextResponse.json({
        orderNumber: order.orderNumber,
        providerCode: 'razorpay',
        providerOrderId: current.providerOrderId,
        amount: Number(current.amount),
        currency: current.currency,
      })
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      providerCode: created.providerCode,
      providerOrderId: created.providerOrderId,
      amount: created.amount,
      currency: created.currency,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Razorpay is not configured') {
      return NextResponse.json({ error: message }, { status: 503 })
    }
    return NextResponse.json({ error: 'Unable to initialize online payment' }, { status: 503 })
  }
}
