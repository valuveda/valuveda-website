export type ShippingAddress = {
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type ShipmentRequest = {
  orderNumber: string
  address: ShippingAddress
  items: Array<{ name: string; sku: string; quantity: number; unitPricePaise: number }>
  paymentMethod: 'ONLINE' | 'COD'
  collectAmountPaise: number
}

export type ShipmentResult = {
  provider: string
  externalShipmentId?: string
  awb?: string
  labelUrl?: string
  trackingUrl?: string
}

export type TrackingResult = {
  providerStatus: string
  status: 'NOT_CREATED' | 'CREATED' | 'AWB_ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED_DELIVERY' | 'RETURNED' | 'CANCELLED'
}

export interface ShippingProvider {
  readonly code: string
  createShipment(request: ShipmentRequest): Promise<ShipmentResult>
  cancelShipment(input: { externalShipmentId: string }): Promise<void>
  getTracking(input: { awb?: string; externalShipmentId?: string }): Promise<TrackingResult>
  getRates?(input: { postalCode: string; weightGrams: number; collectAmountPaise: number }): Promise<Array<{ service: string; amountPaise: number }>>
}
