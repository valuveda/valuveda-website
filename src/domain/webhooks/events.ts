export interface WebhookEnvelope {
  provider: string;
  externalEventId?: string;
  eventType: string;
  payloadHash: string;
  receivedAt: Date;
}

export type WebhookResult =
  | { kind: 'processed' }
  | { kind: 'duplicate' }
  | { kind: 'ignored' }
  | { kind: 'failed'; reason: string };
