export type PrincipalType = 'CUSTOMER' | 'STAFF';

export interface AuthPrincipal {
  subjectId: string;
  type: PrincipalType;
  customerId?: string;
  staffUserId?: string;
  roleCodes: string[];
  permissionCodes: string[];
}

export interface AuthSession {
  principal: AuthPrincipal;
  expiresAt: Date;
}

export interface AuthorizationService {
  requirePermission(session: AuthSession, permissionCode: string): void;
  requireRole(session: AuthSession, roleCode: string): void;
}
