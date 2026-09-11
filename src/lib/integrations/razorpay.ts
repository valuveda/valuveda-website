import { createHmac } from 'node:crypto'
import type { PaymentCreateInput, PaymentCreateResult, PaymentProvider } from './payment'

export class RazorpayPaymentProvider implements PaymentProvider {
  readonly code = 'razorpay'

  async createOrder(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) throw new Error('Razorpay is not configured')

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: Math.round(input.amount * 100), currency: input.currency, receipt: input.orderNumber }),
    })
    if (!response.ok) throw new Error('Razorpay order creation failed')
    const data = (await response.json()) as { id?: string; amount?: number; currency?: string }
    if (!data.id || typeof data.amount !== 'number' || !data.currency) throw new Error('Invalid Razorpay response')

    return { providerCode: this.code, providerOrderId: data.id, amount: data.amount / 100, currency: data.currency }
  }

  async verifyWebhook(rawBody: string, signature: string): Promise<boolean> {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!secret || !signature) return false
    const digest = createHmac('sha256', secret).update(rawBody).digest('hex')
    return digest.length === signature.length && timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  }

  async refund(providerPaymentId: string, amount: number) {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) throw new Error('Razorpay is not configured')
    const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(providerPaymentId)}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: Math.round(amount * 100) }),
    })
    if (!response.ok) throw new Error('Razorpay refund failed')
    const data = (await response.json()) as { id?: string }
    if (!data.id) throw new Error('Invalid Razorpay refund response')
    return { providerRefundId: data.id }
  }
}

function timingSafeEqual(a: Buffer, b: Buffer) {
  return a.length === b.length && require('node:crypto').timingSafeEqual(a, b)
}
