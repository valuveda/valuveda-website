export const STAFF_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  BRANCH_EMPLOYEE: 'BRANCH_EMPLOYEE',
} as const

export type StaffRole = (typeof STAFF_ROLES)[keyof typeof STAFF_ROLES]

export const PERMISSIONS = {
  DASHBOARD_READ: 'dashboard.read',
  ORDERS_READ: 'orders.read',
  ORDERS_WRITE: 'orders.write',
  INVENTORY_READ: 'inventory.read',
  INVENTORY_WRITE: 'inventory.write',
  PRODUCTS_READ: 'products.read',
  PRODUCTS_WRITE: 'products.write',
  CUSTOMERS_READ: 'customers.read',
  COUPONS_READ: 'coupons.read',
  COUPONS_WRITE: 'coupons.write',
  SHIPPING_READ: 'shipping.read',
  SHIPPING_WRITE: 'shipping.write',
  PAYMENTS_READ: 'payments.read',
  STAFF_READ: 'staff.read',
  STAFF_WRITE: 'staff.write',
  AUDIT_READ: 'audit.read',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export function canAccessBranch(role: StaffRole, staffBranchId: string | null, targetBranchId: string | null): boolean {
  if (role === STAFF_ROLES.SUPER_ADMIN || role === STAFF_ROLES.ADMIN) return true
  return Boolean(staffBranchId && targetBranchId && staffBranchId === targetBranchId)
}

export function hasPermission(role: StaffRole, permission: Permission): boolean {
  if (role === STAFF_ROLES.SUPER_ADMIN) return true
  if (role === STAFF_ROLES.ADMIN) return permission !== PERMISSIONS.STAFF_WRITE
  if (role === STAFF_ROLES.BRANCH_MANAGER) {
    return permission.endsWith('.read') || permission === PERMISSIONS.ORDERS_WRITE || permission === PERMISSIONS.INVENTORY_WRITE || permission === PERMISSIONS.COUPONS_WRITE
  }
  return permission === PERMISSIONS.DASHBOARD_READ || permission === PERMISSIONS.ORDERS_READ || permission === PERMISSIONS.INVENTORY_READ
}
