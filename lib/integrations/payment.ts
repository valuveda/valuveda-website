export type PaymentOrderRequest = {
  orderNumber: string
  amountPaise: number
  currency: string
  customer: { name: string; email?: string; phone: string }
}

export type PaymentOrderResult = {
  provider: string
  providerOrderId: string
}

export type PaymentVerification = {
  providerPaymentId: string
  providerOrderId: string
  signature?: string
}

export interface PaymentProvider {
  readonly code: string
  createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult>
  verifyPayment(input: PaymentVerification): Promise<boolean>
  refund(input: { providerPaymentId: string; amountPaise: number }): Promise<{ providerRefundId?: string }>
}
