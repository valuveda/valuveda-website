export interface AuditEvent {
  actorAuthId?: string;
  actorType?: 'CUSTOMER' | 'STAFF' | 'SYSTEM';
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown>;
  occurredAt: Date;
}
