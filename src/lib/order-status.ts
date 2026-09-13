import type { OrderStatus } from '@prisma/client'

const transitions: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PACKED', 'CANCELLED'],
  PACKED: ['DELIVERED'],
  CANCELLED: [],
  DELIVERED: ['RETURN_REQUESTED'],
  RETURN_REQUESTED: ['RETURNED'],
  RETURNED: [],
}

export function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus) {
  return transitions[from]?.includes(to) ?? false
}

export function allowedOrderStatusTransitions(from: OrderStatus) {
  return transitions[from] ?? []
}
