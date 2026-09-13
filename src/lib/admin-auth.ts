import { NextRequest } from 'next/server'
import { db } from '@/src/lib/db'
import { readStaffSession, STAFF_COOKIE_NAME } from '@/src/lib/staff-auth'
import { hasPermission, type Permission } from '@/src/lib/rbac'

export async function requireStaff(request: NextRequest, permission?: Permission) {
  const session = readStaffSession(request.cookies.get(STAFF_COOKIE_NAME)?.value)
  if (!session) throw new Error('Staff authentication required')

  const staff = await db.staffUser.findUnique({
    where: { id: session.staffUserId },
    select: {
      id: true,
      email: true,
      name: true,
      branchId: true,
      status: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
              permissions: { select: { permission: { select: { code: true } } } },
            },
          },
        },
      },
    },
  })
  if (!staff || staff.status !== 'ACTIVE') throw new Error('Staff authentication required')

  const roles = staff.roles.map((entry) => entry.role.name)
  const dbPermissions = new Set(staff.roles.flatMap((entry) => entry.role.permissions.map((item) => item.permission.code)))
  if (permission) {
    const allowed = dbPermissions.has(permission) || roles.some((role) => hasPermission(role as Parameters<typeof hasPermission>[0], permission))
    if (!allowed) throw new Error('Permission denied')
  }

  return { ...staff, roles }
}

export function scopedBranchId(staff: { branchId: string | null; roles: string[] }, requested?: string | null) {
  const elevated = staff.roles.some((role) => role === 'SUPER_ADMIN' || role === 'ADMIN')
  if (elevated) return requested ?? null
  if (!staff.branchId) throw new Error('Branch assignment required')
  if (requested && requested !== staff.branchId) throw new Error('Branch access denied')
  return staff.branchId
}
