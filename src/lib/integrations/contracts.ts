export type Money = { amount: number; currency: "INR" }

export type PaymentCreateRequest = {
  orderNumber: string
  amount: Money
  customer: { name: string; mobile: string; email?: string }
}

export type PaymentCreateResult = {
  provider: string
  providerOrderId?: string
  status: "PENDING" | "PAID"
}

export type PaymentProvider = {
  code: string
  createOrder(request: PaymentCreateRequest): Promise<PaymentCreateResult>
}

export type ShipmentCreateRequest = {
  orderNumber: string
  customer: { name: string; mobile: string }
  address: { line1: string; city: string; state: string; postalCode: string }
  codAmount: number
}

export type ShipmentCreateResult = {
  provider: string
  externalShipmentId?: string
  awb?: string
  trackingUrl?: string
}

export type ShippingProvider = {
  code: string
  createShipment(request: ShipmentCreateRequest): Promise<ShipmentCreateResult>
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ConfigurationError"
  }
}
