import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { requireStaff } from '@/src/lib/admin-auth'
import { PERMISSIONS } from '@/src/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    await requireStaff(request, PERMISSIONS.PRODUCTS_READ)
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, slug: true, sku: true, status: true, description: true, createdAt: true, updatedAt: true,
        variants: { select: { id: true, sku: true, name: true, mrp: true, sellingPrice: true, isDefault: true, isActive: true, inventory: { select: { quantity: true, reserved: true, reorderLevel: true } } } },
        images: { where: { isPrimary: true }, select: { url: true, altText: true }, take: 1 },
      },
    })

    return NextResponse.json({
      products: products.map((product) => ({
        ...product,
        variants: product.variants.map((variant) => ({
          ...variant,
          mrp: Number(variant.mrp),
          sellingPrice: Number(variant.sellingPrice),
          available: variant.inventory ? Math.max(0, variant.inventory.quantity - variant.inventory.reserved) : 0,
        })),
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Staff authentication required') return NextResponse.json({ error: message }, { status: 401 })
    if (message === 'Permission denied') return NextResponse.json({ error: message }, { status: 403 })
    return NextResponse.json({ error: 'Unable to load products' }, { status: 503 })
  }
}
