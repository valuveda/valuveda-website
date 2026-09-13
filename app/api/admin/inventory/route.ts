import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff, scopedBranchId } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    const staff = await requireStaff(request, PERMISSIONS.INVENTORY_READ)
    const branchId = scopedBranchId(staff, request.nextUrl.searchParams.get('branchId'))
    const rows = await db.inventory.findMany({
      where: branchId ? { branchId } : undefined,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        branchId: true,
        variantId: true,
        quantity: true,
        reserved: true,
        reorderLevel: true,
        updatedAt: true,
        variant: { select: { sku: true, name: true, sellingPrice: true, product: { select: { name: true, status: true } } } },
      },
    })

    return NextResponse.json({
      inventory: rows.map((row) => ({
        ...row,
        available: Math.max(0, row.quantity - row.reserved),
        sellingPrice: Number(row.variant.sellingPrice),
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied' || message === 'Branch access denied' || message === 'Branch assignment required') return NextResponse.json({ error: message }, { status: 403 })
    return NextResponse.json({ error: 'Unable to load inventory' }, { status: 503 })
  }
}
