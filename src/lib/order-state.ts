import { OrderStatus, PaymentStatus, ShipmentStatus } from '@prisma/client'

const orderTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PACKED', 'CANCELLED'],
  PACKED: ['DELIVERED', 'CANCELLED'],
  CANCELLED: [],
  DELIVERED: ['RETURN_REQUESTED', 'RETURNED'],
  RETURN_REQUESTED: ['RETURNED'],
  RETURNED: [],
}

const paymentTransitions: Record<PaymentStatus, PaymentStatus[]> = {
  PENDING: ['AUTHORIZED', 'PAID', 'FAILED'],
  AUTHORIZED: ['PAID', 'FAILED', 'REFUND_PENDING'],
  PAID: ['REFUND_PENDING', 'PARTIALLY_REFUNDED', 'REFUNDED'],
  FAILED: ['PENDING'],
  REFUND_PENDING: ['PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED'],
  PARTIALLY_REFUNDED: ['REFUND_PENDING', 'REFUNDED'],
  REFUNDED: [],
}

const shipmentTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
  NOT_CREATED: ['CREATED'],
  CREATED: ['AWB_ASSIGNED', 'CANCELLED'],
  AWB_ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'FAILED_DELIVERY', 'RETURNED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'FAILED_DELIVERY', 'RETURNED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED_DELIVERY', 'RETURNED'],
  DELIVERED: [],
  FAILED_DELIVERY: ['OUT_FOR_DELIVERY', 'RETURNED'],
  RETURNED: [],
  CANCELLED: [],
}

export function canTransitionOrder(from: OrderStatus, to: OrderStatus) {
  return orderTransitions[from].includes(to)
}

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus) {
  return paymentTransitions[from].includes(to)
}

export function canTransitionShipment(from: ShipmentStatus, to: ShipmentStatus) {
  return shipmentTransitions[from].includes(to)
}
