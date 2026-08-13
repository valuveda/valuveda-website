export type PaymentState =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED';

export interface CreatePaymentOrderRequest {
  internalOrderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
}

export interface PaymentOrderResult {
  provider: string;
  providerOrderId: string;
  amount: number;
  currency: string;
}

export interface PaymentVerificationRequest {
  internalOrderId: string;
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}

export interface PaymentVerificationResult {
  state: PaymentState;
  providerPaymentId: string;
  providerOrderId: string;
}

export interface PaymentRefundRequest {
  internalOrderId: string;
  providerPaymentId: string;
  amount: number;
  idempotencyKey: string;
  reason?: string;
}

export interface PaymentRefundResult {
  provider: string;
  providerRefundId: string;
  state: 'PENDING' | 'PROCESSED' | 'FAILED';
  amount: number;
}

export interface PaymentProviderAdapter {
  readonly code: string;
  createPaymentOrder(request: CreatePaymentOrderRequest): Promise<PaymentOrderResult>;
  verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResult>;
  refund(request: PaymentRefundRequest): Promise<PaymentRefundResult>;
}
