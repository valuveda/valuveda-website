export type TrackingLookup = {
  orderNumber: string
  verifiedContact: string
}

export type CustomerOrderSummary = {
  orderNumber: string
  status: string
  paymentStatus: string
  shipmentStatus?: string
  trackingNumber?: string
  trackingUrl?: string
  placedAt: string
}

/**
 * The service layer must verify the customer contact against the authenticated
 * customer before returning order details. Never expose order data by order
 * number alone.
 */
export function canReturnOrderDetails(input: TrackingLookup, authenticatedContact: string) {
  return input.verifiedContact.trim().toLowerCase() === authenticatedContact.trim().toLowerCase()
}
