export type ShipmentCreateInput = {
  orderNumber: string
  customer: { name: string; mobile: string; email?: string | null }
  address: { line1: string; line2?: string | null; city: string; state: string; postalCode: string; country: string }
  items: Array<{ name: string; sku: string; quantity: number; unitPrice: number }>
  paymentMethod: 'ONLINE' | 'COD'
  amount: number
}

export type ShipmentCreateResult = {
  providerCode: string
  externalShipmentId: string
  externalOrderId?: string
  awb?: string
  trackingUrl?: string
  labelUrl?: string
}

export type TrackingResult = {
  status: string
  awb?: string
  trackingUrl?: string
  events: Array<{ status: string; occurredAt?: string; providerStatus: string }>
}

export interface ShippingProvider {
  readonly code: string
  createShipment(input: ShipmentCreateInput): Promise<ShipmentCreateResult>
  getTracking(reference: { awb?: string; externalShipmentId?: string }): Promise<TrackingResult>
}

/** Shipmozo will implement this contract; keeping the provider behind an adapter prevents provider lock-in. */
export class ShipmozoProvider implements ShippingProvider {
  readonly code = 'shipmozo'

  async createShipment(): Promise<ShipmentCreateResult> {
    throw new Error('Shipmozo credentials are not configured')
  }

  async getTracking(): Promise<TrackingResult> {
    throw new Error('Shipmozo credentials are not configured')
  }
}
