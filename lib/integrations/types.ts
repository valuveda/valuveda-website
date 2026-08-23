export type PaymentCreateInput = {
  orderId: string
  amountPaise: number
  currency: string
  customerEmail?: string
  customerPhone?: string
}

export type PaymentResult = {
  provider: string
  providerOrderId: string
  status: 'created' | 'failed'
}

export interface PaymentProvider {
  readonly code: string
  createPaymentOrder(input: PaymentCreateInput): Promise<PaymentResult>
  verifyPayment(input: { providerOrderId: string; providerPaymentId: string; signature: string }): Promise<boolean>
}

export type ShipmentCreateInput = {
  orderId: string
  customerName: string
  customerPhone: string
  address: { line1: string; city: string; state: string; postalCode: string; country: string }
  items: Array<{ sku: string; name: string; quantity: number; unitPricePaise: number }>
  codAmountPaise: number
}

export type ShipmentResult = {
  provider: string
  externalShipmentId: string
  awb?: string
  trackingUrl?: string
}

export interface ShippingProvider {
  readonly code: string
  createShipment(input: ShipmentCreateInput): Promise<ShipmentResult>
  cancelShipment(externalShipmentId: string): Promise<void>
  getTracking(externalShipmentId: string): Promise<{ status: string; trackingUrl?: string }>
}
