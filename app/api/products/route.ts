import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')?.trim() || undefined

  try {
    const products = await db.product.findMany({
      where: { status: 'ACTIVE', ...(slug ? { slug } : {}) },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: [{ isDefault: 'desc' }, { sellingPrice: 'asc' }],
        },
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        sku: product.sku,
        images: product.images.map((image) => ({
          id: image.id,
          url: image.url,
          altText: image.altText,
          sortOrder: image.sortOrder,
          isPrimary: image.isPrimary,
        })),
        variants: product.variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          name: variant.name,
          mrp: Number(variant.mrp),
          sellingPrice: Number(variant.sellingPrice),
          isDefault: variant.isDefault,
        })),
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Catalog temporarily unavailable' }, { status: 503 })
  }
}
