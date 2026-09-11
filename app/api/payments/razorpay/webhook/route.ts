import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { RazorpayPaymentProvider } from '@/src/lib/integrations/razorpay'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''
  const provider = new RazorpayPaymentProvider()

  if (!(await provider.verifyWebhook(rawBody, signature))) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  try {
    const event = JSON.parse(rawBody) as {
      event?: string
      payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string; error_code?: string; error_description?: string } } }
    }
    const payment = event.payload?.payment?.entity
    if (!payment?.order_id || !payment.id) return NextResponse.json({ ok: true })

    const nextStatus = event.event === 'payment.captured' || payment.status === 'captured' ? 'PAID' :
      event.event === 'payment.failed' || payment.status === 'failed' ? 'FAILED' : null
    if (!nextStatus) return NextResponse.json({ ok: true })

    await db.$transaction(async (tx) => {
      const record = await tx.payment.findFirst({ where: { providerCode: 'razorpay', providerOrderId: payment.order_id } })
      if (!record) return
      await tx.payment.update({
        where: { id: record.id },
        data: { status: nextStatus, providerPaymentId: payment.id, failureCode: payment.error_code ?? null, failureMessage: payment.error_description ?? null },
      })
      await tx.order.update({ where: { id: record.orderId }, data: { paymentStatus: nextStatus } })
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 503 })
  }
}
