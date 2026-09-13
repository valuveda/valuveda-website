import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/src/lib/db'
import { readStaffSession, STAFF_COOKIE_NAME } from '@/src/lib/staff-auth'
import { canTransitionOrderStatus, allowedOrderStatusTransitions } from '@/src/lib/order-status'
import OrderStatusControl from './OrderStatusControl'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const session = readStaffSession((await cookies()).get(STAFF_COOKIE_NAME)?.value)
  if (!session) redirect('/admin/login')
  const staff = await db.staffUser.findUnique({ where: { id: session.staffUserId }, select: { name: true, status: true, branchId: true, roles: { select: { role: { select: { name: true } } } } } })
  if (!staff || staff.status !== 'ACTIVE') redirect('/admin/login')
  const { orderNumber } = await params
  const roles = staff.roles.map((x) => x.role.name)
  const elevated = roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')
  const order = await db.order.findUnique({
    where: { orderNumber },
    select: {
      id: true, orderNumber: true, status: true, paymentStatus: true, paymentMethod: true, codVerificationStatus: true,
      currency: true, subtotal: true, discountTotal: true, shippingTotal: true, taxTotal: true, grandTotal: true,
      customerName: true, customerMobile: true, customerEmail: true, shippingAddressSnapshot: true, placedAt: true, createdAt: true, cancelledAt: true, deliveredAt: true,
      items: { select: { productNameSnapshot: true, variantNameSnapshot: true, skuSnapshot: true, quantity: true, unitMrp: true, unitPrice: true, discountAmount: true, lineTotal: true } },
      payments: { orderBy: { createdAt: 'desc' }, select: { providerCode: true, providerOrderId: true, providerPaymentId: true, method: true, status: true, amount: true, currency: true, failureMessage: true, createdAt: true } },
      shipments: { orderBy: { createdAt: 'desc' }, select: { status: true, awb: true, trackingUrl: true, providerStatus: true, createdAt: true, pickedUpAt: true, deliveredAt: true } },
      items: { select: { productNameSnapshot: true, variantNameSnapshot: true, skuSnapshot: true, quantity: true, unitMrp: true, unitPrice: true, discountAmount: true, lineTotal: true, variant: { select: { inventory: { select: { branchId: true } } } } } },
    },
  })
  if (!order) notFound()
  if (staff.branchId && !elevated && !order.items.some((item) => item.variant.inventory.some((inventory) => inventory.branchId === staff.branchId))) redirect('/admin/orders')

  const allowed = allowedOrderStatusTransitions(order.status)
  const money = (value: unknown) => `₹${Number(value).toLocaleString('en-IN')}`
  const address = order.shippingAddressSnapshot as Record<string, unknown>

  return <main className="min-h-screen bg-[#101d18] text-white">
    <header className="border-b border-white/10"><div className="mx-auto max-w-5xl px-5 py-5"><Link href="/admin/orders" className="text-sm text-white/50">← Orders</Link><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-semibold">{order.orderNumber}</h1><p className="mt-1 text-sm text-white/45">{order.createdAt.toLocaleString('en-IN')} · {roles.join(', ')}</p></div><OrderStatusControl orderNumber={order.orderNumber} currentStatus={order.status} allowed={allowed.filter((next) => canTransitionOrderStatus(order.status, next))} /></div></div></header>
    <section className="mx-auto grid max-w-5xl gap-5 px-5 py-7 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 p-5"><h2 className="font-medium">Customer</h2><div className="mt-4 space-y-1 text-sm"><p>{order.customerName}</p><p className="text-white/55">{order.customerMobile}</p>{order.customerEmail && <p className="text-white/55">{order.customerEmail}</p>}</div></div>
      <div className="rounded-2xl border border-white/10 p-5"><h2 className="font-medium">Payment</h2><div className="mt-4 space-y-1 text-sm"><p>{order.paymentMethod} · {order.paymentStatus}</p><p className="text-white/55">COD: {order.codVerificationStatus}</p>{order.payments[0] && <p className="text-white/55">{order.payments[0].providerCode} · {order.payments[0].status}</p>}</div></div>
      <div className="rounded-2xl border border-white/10 p-5 md:col-span-2"><h2 className="font-medium">Items</h2><div className="mt-4 divide-y divide-white/10">{order.items.map((item) => <div key={item.skuSnapshot} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"><div><p>{item.productNameSnapshot}</p><p className="text-white/45">{item.variantNameSnapshot} · {item.skuSnapshot} · Qty {item.quantity}</p></div><div className="text-right"><p>{money(item.lineTotal)}</p><p className="text-white/40">{money(item.unitPrice)} each</p></div></div>)}</div><div className="mt-5 border-t border-white/10 pt-4 text-sm"><div className="flex justify-between"><span className="text-white/45">Subtotal</span><span>{money(order.subtotal)}</span></div><div className="flex justify-between"><span className="text-white/45">Discount</span><span>-{money(order.discountTotal)}</span></div><div className="flex justify-between"><span className="text-white/45">Shipping</span><span>{money(order.shippingTotal)}</span></div><div className="mt-2 flex justify-between text-base font-semibold"><span>Total</span><span>{money(order.grandTotal)}</span></div></div></div>
      <div className="rounded-2xl border border-white/10 p-5"><h2 className="font-medium">Delivery address</h2><div className="mt-4 text-sm leading-6 text-white/65">{Object.entries(address).filter(([, value]) => value).map(([key, value]) => <div key={key}>{String(value)}</div>)}</div></div>
      <div className="rounded-2xl border border-white/10 p-5"><h2 className="font-medium">Shipment</h2>{order.shipments[0] ? <div className="mt-4 space-y-1 text-sm"><p>{order.shipments[0].status}</p><p className="text-white/55">AWB: {order.shipments[0].awb ?? '—'}</p>{order.shipments[0].trackingUrl && <a className="text-white underline" href={order.shipments[0].trackingUrl}>Tracking</a>}</div> : <p className="mt-4 text-sm text-white/45">Shipment not created.</p>}</div>
    </section>
  </main>
}
