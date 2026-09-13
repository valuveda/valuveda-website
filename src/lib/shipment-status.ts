import type { ShipmentStatus } from '@prisma/client'

const transitions: Record<ShipmentStatus, readonly ShipmentStatus[]> = {
  NOT_CREATED: ['CREATED', 'CANCELLED'],
  CREATED: ['AWB_ASSIGNED', 'CANCELLED'],
  AWB_ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'RETURNED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'RETURNED', 'FAILED_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED_DELIVERY', 'RETURNED'],
  DELIVERED: [],
  FAILED_DELIVERY: ['OUT_FOR_DELIVERY', 'RETURNED'],
  RETURNED: [],
  CANCELLED: [],
}

export function canTransitionShipmentStatus(from: ShipmentStatus, to: ShipmentStatus) {
  return transitions[from]?.includes(to) ?? false
}

export function allowedShipmentStatusTransitions(from: ShipmentStatus) {
  return transitions[from] ?? []
}
