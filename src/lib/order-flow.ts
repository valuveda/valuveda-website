export type OrderFlowState = {
  order: "PENDING" | "CONFIRMED" | "PROCESSING" | "PACKED" | "CANCELLED" | "DELIVERED"
  payment: "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUND_PENDING" | "PARTIALLY_REFUNDED" | "REFUNDED"
  shipment: "NOT_CREATED" | "CREATED" | "AWB_ASSIGNED" | "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "FAILED_DELIVERY" | "RETURNED" | "CANCELLED"
}

const orderTransitions: Record<OrderFlowState["order"], readonly OrderFlowState["order"][]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["DELIVERED", "CANCELLED"],
  CANCELLED: [],
  DELIVERED: [],
}

const paymentTransitions: Record<OrderFlowState["payment"], readonly OrderFlowState["payment"][]> = {
  PENDING: ["AUTHORIZED", "PAID", "FAILED"],
  AUTHORIZED: ["PAID", "FAILED", "REFUND_PENDING"],
  PAID: ["REFUND_PENDING"],
  FAILED: ["PENDING"],
  REFUND_PENDING: ["PARTIALLY_REFUNDED", "REFUNDED"],
  PARTIALLY_REFUNDED: ["REFUND_PENDING", "REFUNDED"],
  REFUNDED: [],
}

const shipmentTransitions: Record<OrderFlowState["shipment"], readonly OrderFlowState["shipment"][]> = {
  NOT_CREATED: ["CREATED"],
  CREATED: ["AWB_ASSIGNED", "CANCELLED"],
  AWB_ASSIGNED: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["IN_TRANSIT", "FAILED_DELIVERY"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY", "FAILED_DELIVERY", "RETURNED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "FAILED_DELIVERY", "RETURNED"],
  DELIVERED: [],
  FAILED_DELIVERY: ["OUT_FOR_DELIVERY", "RETURNED"],
  RETURNED: [],
  CANCELLED: [],
}

export function canTransitionOrder(from: OrderFlowState["order"], to: OrderFlowState["order"]) {
  return orderTransitions[from].includes(to)
}

export function canTransitionPayment(from: OrderFlowState["payment"], to: OrderFlowState["payment"]) {
  return paymentTransitions[from].includes(to)
}

export function canTransitionShipment(from: OrderFlowState["shipment"], to: OrderFlowState["shipment"]) {
  return shipmentTransitions[from].includes(to)
}
