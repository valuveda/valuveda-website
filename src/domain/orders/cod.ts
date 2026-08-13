export type CodVerificationStatus =
  | 'NOT_COD'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'CUSTOMER_UNREACHABLE'
  | 'CANCELLED';

export interface CodVerificationDecision {
  status: Exclude<CodVerificationStatus, 'NOT_COD' | 'PENDING_VERIFICATION'>;
  staffAuthId: string;
  note?: string;
  decidedAt: Date;
}

export function canFulfillCod(status: CodVerificationStatus): boolean {
  return status === 'VERIFIED';
}
