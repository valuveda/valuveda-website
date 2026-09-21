import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    await requireStaff(request, PERMISSIONS.SHIPPING_READ)
    const providers = await db.shippingProvider.findMany({
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      select: { id: true, code: true, name: true, status: true, isDefault: true },
    })
    return NextResponse.json({ providers })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    return NextResponse.json({ error: message || 'Unable to load shipping providers' }, { status: message === 'Permission denied' ? 403 : 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const staff = await requireStaff(request, PERMISSIONS.SHIPPING_WRITE)
    const body = await request.json().catch(() => ({}))
    const code = typeof body.code === 'string' ? body.code.trim().toLowerCase() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!/^[a-z0-9][a-z0-9_-]{1,49}$/.test(code) || !name) {
      return NextResponse.json({ error: 'Valid provider code and name are required' }, { status: 400 })
    }
    const provider = await db.shippingProvider.upsert({
      where: { code },
      create: { code, name, status: 'DISABLED', isDefault: false },
      update: { name },
      select: { id: true, code: true, name: true, status: true, isDefault: true },
    })
    return NextResponse.json({ provider }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    return NextResponse.json({ error: message || 'Unable to save shipping provider' }, { status: message === 'Permission denied' ? 403 : 401 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireStaff(request, PERMISSIONS.SHIPPING_WRITE)
    const body = await request.json().catch(() => ({}))
    const id = typeof body.id === 'string' ? body.id : ''
    const status = body.status === 'ENABLED' || body.status === 'DISABLED' || body.status === 'ARCHIVED' ? body.status : null
    const isDefault = typeof body.isDefault === 'boolean' ? body.isDefault : undefined
    if (!id || (!status && isDefault === undefined)) return NextResponse.json({ error: 'Provider update is required' }, { status: 400 })

    const provider = await db.$transaction(async (tx) => {
      if (isDefault === true) {
        await tx.shippingProvider.updateMany({ data: { isDefault: false }, where: { isDefault: true } })
      }
      return tx.shippingProvider.update({
        where: { id },
        data: { ...(status ? { status } : {}), ...(isDefault !== undefined ? { isDefault } : {}) },
        select: { id: true, code: true, name: true, status: true, isDefault: true },
      })
    })
    return NextResponse.json({ provider })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    return NextResponse.json({ error: message || 'Unable to update shipping provider' }, { status: message === 'Permission denied' ? 403 : 401 })
  }
}
