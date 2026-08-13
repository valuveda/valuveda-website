export type ShipmentStatus =
  | 'NOT_CREATED'
  | 'CREATING'
  | 'CREATION_UNKNOWN'
  | 'CREATED'
  | 'AWB_ASSIGNED'
  | 'LABEL_READY'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'NDR'
  | 'DELIVERY_FAILED'
  | 'RTO_INITIATED'
  | 'RTO'
  | 'CANCELLED'
  | 'LOST'
  | 'DAMAGED'
  | 'UNKNOWN';

export interface ShipmentAddress {
  recipientName: string;
  mobile: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateShipmentRequest {
  orderNumber: string;
  paymentMethod: 'PREPAID' | 'COD';
  amount: number;
  weightGrams: number;
  address: ShipmentAddress;
  items: Array<{ name: string; sku?: string; quantity: number; unitPrice: number }>;
}

export interface ShipmentResult {
  provider: string;
  externalOrderId?: string;
  externalShipmentId?: string;
  awb?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  labelReference?: string;
  status: ShipmentStatus;
  providerStatus?: string;
}

export interface TrackingResult {
  status: ShipmentStatus;
  providerStatus: string;
  eventTime: Date;
  location?: string;
  description?: string;
  providerEventId?: string;
}

export interface ShippingProviderAdapter {
  readonly code: string;
  readonly name: string;
  createShipment(request: CreateShipmentRequest): Promise<ShipmentResult>;
  getShipment(externalShipmentId: string): Promise<ShipmentResult>;
  getTracking(reference: string): Promise<TrackingResult[]>;
  cancelShipment?(externalShipmentId: string): Promise<void>;
  getLabel?(externalShipmentId: string): Promise<{ labelReference: string }>;
  checkServiceability?(postalCode: string, paymentMethod: 'PREPAID' | 'COD'): Promise<boolean>;
  normalizeWebhook(input: unknown): TrackingResult | null;
}
