import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { createCartSessionKey, getCartSessionKey, setCartSessionCookie } from '@/src/lib/cart-session'

const MAX_ITEM_QUANTITY = 20

export async function GET() {
  const sessionKey = await getCartSessionKey()
  if (!sessionKey) return NextResponse.json({ items: [] })

  try {
    const cart = await db.cart.findFirst({
      where: { sessionKey, status: 'ACTIVE' },
      include: { items: { include: { product: true, variant: true } } },
    })
    if (!cart) return NextResponse.json({ items: [] })

    return NextResponse.json({
      cartId: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product.name,
        variantName: item.variant.name,
        sku: item.variant.sku,
        quantity: item.quantity,
        mrp: Number(item.variant.mrp),
        sellingPrice: Number(item.variant.sellingPrice),
        lineTotal: Number(item.variant.sellingPrice) * item.quantity,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Cart temporarily unavailable' }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const variantId = typeof body.variantId === 'string' ? body.variantId : ''
    const quantity = Number(body.quantity)
    if (!variantId || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
      return NextResponse.json({ error: 'Invalid cart item' }, { status: 400 })
    }

    const variant = await db.productVariant.findFirst({
      where: { id: variantId, isActive: true, product: { status: 'ACTIVE' } },
      select: { id: true, productId: true },
    })
    if (!variant) return NextResponse.json({ error: 'Product variant unavailable' }, { status: 404 })

    let sessionKey = await getCartSessionKey()
    if (!sessionKey) {
      sessionKey = createCartSessionKey()
      await setCartSessionCookie(sessionKey)
    }

    const cart = await db.cart.upsert({
      where: { sessionKey },
      create: { sessionKey, status: 'ACTIVE' },
      update: { status: 'ACTIVE' },
    })

    const existing = await db.cartItem.findUnique({ where: { cartId_variantId: { cartId: cart.id, variantId } } })
    const nextQuantity = Math.min(MAX_ITEM_QUANTITY, (existing?.quantity ?? 0) + quantity)

    await db.cartItem.upsert({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
      create: { cartId: cart.id, productId: variant.productId, variantId, quantity },
      update: { quantity: nextQuantity },
    })

    return NextResponse.json({ ok: true, quantity: nextQuantity }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unable to update cart' }, { status: 503 })
  }
}
