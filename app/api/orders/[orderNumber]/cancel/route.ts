import { NextRequest, NextResponse } from 'next/server'
import { cancelOrder } from '@/src/lib/orders/cancel-order'

export async function POST(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const mobile = request.nextUrl.searchParams.get('mobile')?.replace(/\D/g, '') ?? ''
  if (!/^\d{10}$/.test(mobile)) return NextResponse.json({ error: 'Mobile verification is required' }, { status: 400 })

  try {
    const result = await cancelOrder(orderNumber)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Order not found') return NextResponse.json({ error: message }, { status: 404 })
    if (message === 'Order cannot be cancelled') return NextResponse.json({ error: message }, { status: 409 })
    return NextResponse.json({ error: 'Unable to cancel order' }, { status: 503 })
  }
}
