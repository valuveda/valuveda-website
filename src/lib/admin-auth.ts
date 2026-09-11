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
      status: true,
      roles: { select: { role: { select: { name: true } } } },
    },
  })
  if (!staff || staff.status !== 'ACTIVE') throw new Error('Staff authentication required')

  const roles = staff.roles.map((entry) => entry.role.name)
  if (permission && !roles.some((role) => hasPermission(role as Parameters<typeof hasPermission>[0], permission))) {
    throw new Error('Permission denied')
  }

  return { ...staff, roles }
}
