export type PaymentCreateInput = {
  orderNumber: string
  amount: number
  currency: string
  customer: { name: string; mobile: string; email?: string | null }
}

export type PaymentCreateResult = {
  providerCode: string
  providerOrderId: string
  amount: number
  currency: string
}

export interface PaymentProvider {
  readonly code: string
  createOrder(input: PaymentCreateInput): Promise<PaymentCreateResult>
  verifyWebhook(rawBody: string, signature: string): Promise<boolean>
  refund?(providerPaymentId: string, amount: number): Promise<{ providerRefundId: string }>
}

export class CodPaymentProvider implements PaymentProvider {
  readonly code = 'cod'

  async createOrder(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    return { providerCode: this.code, providerOrderId: input.orderNumber, amount: input.amount, currency: input.currency }
  }

  async verifyWebhook(): Promise<boolean> {
    return false
  }
}

/** Razorpay is deliberately an adapter boundary. Credentials are read only on the server when implementation is enabled. */
export function getPaymentProvider(method: 'COD' | 'ONLINE'): PaymentProvider {
  if (method === 'COD') return new CodPaymentProvider()
  throw new Error('ONLINE payment provider is not configured')
}
