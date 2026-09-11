import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { RazorpayPaymentProvider } from '@/src/lib/integrations/razorpay'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''
  const provider = new RazorpayPaymentProvider()
  if (!(await provider.verifyWebhook(rawBody, signature))) return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })

  try {
    const event = JSON.parse(rawBody) as {
      event?: string
      payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string; amount?: number; currency?: string; error_code?: string; error_description?: string } } }
    }
    const payment = event.payload?.payment?.entity
    if (!payment?.order_id || !payment.id) return NextResponse.json({ ok: true })
    const nextStatus = event.event === 'payment.captured' || payment.status === 'captured' ? 'PAID' : event.event === 'payment.failed' || payment.status === 'failed' ? 'FAILED' : null
    if (!nextStatus) return NextResponse.json({ ok: true })
    const eventId = request.headers.get('x-razorpay-event-id')?.trim() || createHash('sha256').update(rawBody).digest('hex')

    const result = await db.$transaction(async (tx) => {
      const inserted = await tx.webhookEvent.createMany({
        data: [{ providerCode: 'razorpay', eventId, eventType: event.event ?? 'unknown', payload: event }],
        skipDuplicates: true,
      })
      if (inserted.count === 0) return 'duplicate'

      const record = await tx.payment.findFirst({
        where: { providerCode: 'razorpay', providerOrderId: payment.order_id },
        select: { id: true, orderId: true, amount: true, currency: true, status: true },
      })
      if (!record) {
        await tx.webhookEvent.update({ where: { providerCode_eventId: { providerCode: 'razorpay', eventId } }, data: { status: 'FAILED', errorMessage: 'Payment record not found', processedAt: new Date() } })
        return 'ignored'
      }
      if (payment.amount != null && payment.amount !== Math.round(Number(record.amount) * 100)) {
        await tx.webhookEvent.update({ where: { providerCode_eventId: { providerCode: 'razorpay', eventId } }, data: { status: 'FAILED', errorMessage: 'Payment amount mismatch', processedAt: new Date() } })
        return 'invalid'
      }
      if (payment.currency && payment.currency !== record.currency) {
        await tx.webhookEvent.update({ where: { providerCode_eventId: { providerCode_eventId: 'razorpay', eventId } }, data: { status: 'FAILED', errorMessage: 'Payment currency mismatch', processedAt: new Date() } })
        return 'invalid'
      }
      if (record.status !== 'PAID') {
        await tx.payment.update({ where: { id: record.id }, data: { status: nextStatus, providerPaymentId: payment.id, failureCode: payment.error_code ?? null, failureMessage: payment.error_description ?? null } })
        await tx.order.update({ where: { id: record.orderId }, data: { paymentStatus: nextStatus } })
      }
      await tx.webhookEvent.update({ where: { providerCode_eventId: { providerCode: 'razorpay', eventId } }, data: { status: 'PROCESSED', processedAt: new Date() } })
      return 'processed'
    })
    if (result === 'invalid') return NextResponse.json({ error: 'Payment validation failed' }, { status: 422 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 503 })
  }
}
