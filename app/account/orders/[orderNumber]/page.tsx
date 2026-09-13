import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/src/lib/db'
import { COOKIE_NAME, readCustomerSession } from '@/src/lib/customer-session'

const steps = ['CONFIRMED', 'PROCESSING', 'PACKED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED']

export default async function OrderTrackingPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const session = readCustomerSession((await cookies()).get(COOKIE_NAME)?.value)
  if (!session) redirect('/account/login')
  const { orderNumber } = await params
  const order = await db.order.findFirst({
    where: { orderNumber, customerId: session.customerId },
    select: { orderNumber: true, status: true, paymentStatus: true, grandTotal: true, createdAt: true, shipments: { orderBy: { createdAt: 'desc' }, take: 1, select: { status: true, awb: true, trackingUrl: true, trackingEvents: { orderBy: { occurredAt: 'desc' }, select: { normalizedStatus: true, providerStatus: true, occurredAt: true } } } }, items: { select: { productNameSnapshot: true, variantNameSnapshot: true, quantity: true, lineTotal: true } } },
  })
  if (!order) notFound()
  const shipment = order.shipments[0]
  const current = shipment?.status === 'DELIVERED' ? 6 : shipment ? Math.max(0, steps.indexOf(shipment.status)) : Math.min(2, steps.indexOf(order.status))
  return <main className="min-h-screen bg-[#f6f2e9] text-[#17352a]"><header className="border-b border-[#17352a]/10"><div className="mx-auto max-w-5xl px-5 py-5"><Link href="/account/orders" className="text-sm text-[#17352a]/55">← My Orders</Link><h1 className="mt-3 text-3xl font-semibold">Track {order.orderNumber}</h1><p className="mt-1 text-sm text-[#17352a]/50">Placed {order.createdAt.toLocaleString('en-IN')}</p></div></header><section className="mx-auto max-w-5xl space-y-5 px-5 py-8"><div className="rounded-3xl border border-[#17352a]/10 bg-white/70 p-7"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-sm text-[#17352a]/45">Order status</p><p className="mt-1 text-xl font-semibold">{order.status}</p></div><div className="text-right"><p className="text-sm text-[#17352a]/45">Total</p><p className="mt-1 text-xl font-semibold">₹{Number(order.grandTotal).toLocaleString('en-IN')}</p></div></div><div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-7">{steps.map((step, index) => <div key={step} className={`rounded-2xl p-3 text-center text-xs ${index <= current ? 'bg-[#17352a] text-white' : 'bg-[#e9e2d5] text-[#17352a]/45'}`}><span className="block font-semibold">{index + 1}</span><span className="mt-1 block">{step.replaceAll('_', ' ')}</span></div>)}</div>{shipment?.trackingUrl && <a href={shipment.trackingUrl} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full bg-[#17352a] px-5 py-3 text-sm font-semibold text-white">Open live tracking</a>}{shipment?.awb && <p className="mt-4 text-sm text-[#17352a]/60">AWB: <b>{shipment.awb}</b></p>}</div><div className="rounded-3xl border border-[#17352a]/10 bg-white/70 p-7"><h2 className="text-lg font-semibold">Items</h2><div className="mt-4 divide-y divide-[#17352a]/10">{order.items.map((item, index) => <div key={`${item.variantNameSnapshot}-${index}`} className="flex justify-between gap-4 py-4 text-sm"><div><p className="font-medium">{item.productNameSnapshot}</p><p className="text-[#17352a]/50">{item.variantNameSnapshot} · Qty {item.quantity}</p></div><p className="font-semibold">₹{Number(item.lineTotal).toLocaleString('en-IN')}</p></div>)}</div></div>{shipment?.trackingEvents?.length ? <div className="rounded-3xl border border-[#17352a]/10 bg-white/70 p-7"><h2 className="text-lg font-semibold">Tracking updates</h2><div className="mt-4 space-y-4">{shipment.trackingEvents.map((event, index) => <div key={`${event.providerStatus}-${event.occurredAt}-${index}`} className="border-l-2 border-[#8b6b3f] pl-4"><p className="font-medium">{event.providerStatus}</p>{event.occurredAt && <p className="text-xs text-[#17352a]/50">{new Date(event.occurredAt).toLocaleString('en-IN')}</p>}</div>)}</div></div> : null}</section></main>
}
