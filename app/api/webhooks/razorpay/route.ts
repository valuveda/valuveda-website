import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { RazorpayPaymentProvider } from '@/src/lib/integrations/razorpay'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''
  const eventId = request.headers.get('x-razorpay-event-id') ?? ''
  const provider = new RazorpayPaymentProvider()

  if (!(await provider.verifyWebhook(rawBody, signature))) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  let event: {
    event?: string
    payload?: {
      payment?: {
        entity?: {
          id?: string
          order_id?: string
          status?: string
          amount?: number
          currency?: string
          error_code?: string
          error_description?: string
        }
      }
    }
  }

  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
  }

  const payment = event.payload?.payment?.entity
  if (!payment?.order_id || !payment.id) return NextResponse.json({ ok: true })

  const nextStatus =
    event.event === 'payment.captured' || payment.status === 'captured' ? 'PAID' :
    event.event === 'payment.failed' || payment.status === 'failed' ? 'FAILED' : null

  if (!nextStatus) return NextResponse.json({ ok: true })

  try {
    await db.$transaction(async (tx) => {
      if (eventId) {
        try {
          await tx.webhookEvent.create({
            data: {
              providerCode: 'razorpay',
              eventId,
              eventType: event.event ?? 'unknown',
              status: 'RECEIVED',
              payload: event as object,
            },
          })
        } catch (error) {
          if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') return
          throw error
        }
      }

      const record = await tx.payment.findFirst({
        where: { providerCode: 'razorpay', providerOrderId: payment.order_id },
        select: {
          id: true,
          orderId: true,
          status: true,
          amount: true,
          currency: true,
          order: { select: { id: true, paymentStatus: true } },
        },
      })
      if (!record) return

      if (payment.amount !== undefined && payment.amount !== Math.round(Number(record.amount) * 100)) {
        throw new Error('Razorpay webhook amount mismatch')
      }
      if (payment.currency && payment.currency !== record.currency) {
        throw new Error('Razorpay webhook currency mismatch')
      }

      // Never let a late failed event overwrite an already captured payment.
      if (record.status === 'PAID' && nextStatus === 'FAILED') return
      if (record.status === nextStatus) return

      await tx.payment.update({
        where: { id: record.id },
        data: {
          status: nextStatus,
          providerPaymentId: payment.id,
          failureCode: payment.error_code ?? null,
          failureMessage: payment.error_description ?? null,
        },
      })
      await tx.order.update({
        where: { id: record.orderId },
        data: { paymentStatus: nextStatus },
      })

      if (eventId) {
        await tx.webhookEvent.update({
          where: { providerCode_eventId: { providerCode: 'razorpay', eventId } },
          data: { status: 'PROCESSED', processedAt: new Date() },
        })
      }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message.includes('webhook amount mismatch') || message.includes('webhook currency mismatch')) {
      return NextResponse.json({ error: message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 503 })
  }
}
