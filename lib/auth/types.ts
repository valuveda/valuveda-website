export type CustomerIdentity = {
  id: string
  phone?: string
  email?: string
}

export type CustomerLoginRequest =
  | { method: 'phone'; phone: string; otp: string }
  | { method: 'email'; email: string; password: string }

export type StaffIdentity = {
  id: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'BRANCH_MANAGER' | 'BRANCH_EMPLOYEE'
  branchId?: string
}

export type Permission =
  | 'orders.read' | 'orders.update' | 'orders.cancel'
  | 'payments.read' | 'refunds.create'
  | 'inventory.read' | 'inventory.adjust'
  | 'products.read' | 'products.write'
  | 'coupons.read' | 'coupons.write'
  | 'shipping.read' | 'shipping.dispatch'
  | 'customers.read' | 'staff.read' | 'staff.manage'
  | 'branches.manage' | 'settings.manage' | 'audit.read'

export const ROLE_PERMISSIONS: Record<StaffIdentity['role'], Permission[]> = {
  SUPER_ADMIN: ['orders.read','orders.update','orders.cancel','payments.read','refunds.create','inventory.read','inventory.adjust','products.read','products.write','coupons.read','coupons.write','shipping.read','shipping.dispatch','customers.read','staff.read','staff.manage','branches.manage','settings.manage','audit.read'],
  ADMIN: ['orders.read','orders.update','orders.cancel','payments.read','refunds.create','inventory.read','inventory.adjust','products.read','products.write','coupons.read','coupons.write','shipping.read','shipping.dispatch','customers.read','staff.read','audit.read'],
  BRANCH_MANAGER: ['orders.read','orders.update','inventory.read','inventory.adjust','shipping.read','shipping.dispatch','customers.read','staff.read'],
  BRANCH_EMPLOYEE: ['orders.read','orders.update','inventory.read','shipping.read','shipping.dispatch'],
}

export function hasPermission(role: StaffIdentity['role'], permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission)
}
