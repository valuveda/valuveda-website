import { NextRequest } from 'next/server'
import { db } from '@/src/lib/db'
import { STAFF_COOKIE_NAME, readStaffSession } from '@/src/lib/staff-auth'

export type StaffAuth = {
  id: string
  email: string
  name: string
  branchId: string | null
  roleNames: string[]
  permissions: string[]
}

export async function getStaffAuth(request: NextRequest): Promise<StaffAuth | null> {
  const session = readStaffSession(request.cookies.get(STAFF_COOKIE_NAME)?.value)
  if (!session) return null
  const staff = await db.staffUser.findUnique({
    where: { id: session.staffUserId },
    select: {
      id: true, email: true, name: true, branchId: true, status: true,
      roles: { select: { role: { select: { name: true, permissions: { select: { permission: { select: { code: true } } } } } } } },
    },
  })
  if (!staff || staff.status !== 'ACTIVE') return null
  const roleNames = staff.roles.map(({ role }) => role.name)
  const permissions = Array.from(new Set(staff.roles.flatMap(({ role }) => role.permissions.map(({ permission }) => permission.code))))
  return { id: staff.id, email: staff.email, name: staff.name, branchId: staff.branchId, roleNames, permissions }
}

export function hasPermission(staff: StaffAuth, permission: string) {
  return staff.roleNames.some((role) => role === 'SUPER_ADMIN' || role === 'ADMIN') || staff.permissions.includes(permission)
}

export function canAccessBranch(staff: StaffAuth, targetBranchId: string | null | undefined) {
  if (!targetBranchId || staff.roleNames.some((role) => role === 'SUPER_ADMIN' || role === 'ADMIN')) return true
  return staff.branchId === targetBranchId
}

export async function requireStaff(request: NextRequest, permission?: string) {
  const staff = await getStaffAuth(request)
  if (!staff) return { staff: null as null, error: 'UNAUTHORIZED' as const }
  if (permission && !hasPermission(staff, permission)) return { staff: null as null, error: 'FORBIDDEN' as const }
  return { staff, error: null }
}
