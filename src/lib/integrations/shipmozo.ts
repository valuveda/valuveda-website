export type CreateShipmentInput = {
  orderNumber: string
  customer: { name: string; mobile: string; email?: string | null }
  address: { line1: string; line2?: string; city: string; state: string; postalCode: string; country?: string }
  items: Array<{ name: string; sku: string; quantity: number; unitPrice: number }>
  paymentMethod: 'COD' | 'ONLINE'
  amount: number
}

export type CreateShipmentResult = {
  providerCode: 'shipmozo'
  externalShipmentId: string
  awb?: string
  trackingUrl?: string
}

export class ShipmozoProvider {
  readonly code = 'shipmozo' as const

  async createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult> {
    const token = process.env.SHIPMOZO_API_TOKEN
    if (!token) throw new Error('Shipmozo is not configured')

    // Keep the provider payload isolated here; API field mapping can evolve without changing order logic.
    const response = await fetch(`${process.env.SHIPMOZO_API_URL ?? 'https://shipmozo.com'}/api/v1/shipments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!response.ok) throw new Error('Shipmozo shipment creation failed')
    const data = (await response.json()) as { shipment_id?: string; awb?: string; tracking_url?: string }
    if (!data.shipment_id) throw new Error('Invalid Shipmozo response')

    return {
      providerCode: this.code,
      externalShipmentId: data.shipment_id,
      awb: data.awb,
      trackingUrl: data.tracking_url,
    }
  }
}
