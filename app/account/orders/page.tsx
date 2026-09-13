import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/src/lib/db'
import { COOKIE_NAME, readCustomerSession } from '@/src/lib/customer-session'

export default async function OrdersPage() {
  const session = readCustomerSession((await cookies()).get(COOKIE_NAME)?.value)
  if (!session) redirect('/account/login')
  const orders = await db.order.findMany({
    where: { customerId: session.customerId },
    orderBy: { createdAt: 'desc' },
    take: 25,
    select: { orderNumber: true, status: true, paymentStatus: true, grandTotal: true, createdAt: true, shipments: { orderBy: { createdAt: 'desc' }, take: 1, select: { status: true, awb: true } } },
  })
  const money = (value: unknown) => `₹${Number(value).toLocaleString('en-IN')}`
  return <main className="min-h-screen bg-[#f6f2e9] text-[#17352a]"><header className="border-b border-[#17352a]/10"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link href="/" className="font-semibold">ValuVeda Wellness</Link><span className="text-sm text-[#17352a]/60">My Orders</span></div></header><section className="mx-auto max-w-6xl px-5 py-12"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#8b6b3f]">Customer account</p><h1 className="mt-3 text-4xl font-semibold">My Orders</h1>{orders.length === 0 ? <div className="mt-8 rounded-3xl border border-[#17352a]/10 bg-white/60 p-8"><p className="text-[#17352a]/60">No orders yet.</p><Link href="/product" className="mt-5 inline-block rounded-full bg-[#17352a] px-5 py-3 text-sm font-semibold text-white">Shop Karela Jamun Powder</Link></div> : <div className="mt-8 space-y-4">{orders.map((order) => { const shipment = order.shipments[0]; return <Link key={order.orderNumber} href={`/account/orders/${order.orderNumber}`} className="block rounded-3xl border border-[#17352a]/10 bg-white/70 p-6 transition hover:bg-white"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.2em] text-[#17352a]/45">Order</p><h2 className="mt-1 text-xl font-semibold">{order.orderNumber}</h2><p className="mt-1 text-sm text-[#17352a]/50">{order.createdAt.toLocaleString('en-IN')}</p></div><span className="rounded-full bg-[#e6ddca] px-4 py-2 text-xs font-semibold">{order.status}</span></div><div className="mt-5 grid gap-3 text-sm sm:grid-cols-3"><div><span className="text-[#17352a]/45">Total</span><p className="mt-1 font-semibold">{money(order.grandTotal)}</p></div><div><span className="text-[#17352a]/45">Payment</span><p className="mt-1">{order.paymentStatus}</p></div><div><span className="text-[#17352a]/45">Shipment</span><p className="mt-1">{shipment?.status ?? 'Not created'}{shipment?.awb ? ` · ${shipment.awb}` : ''}</p></div></div><p className="mt-5 text-sm font-semibold">View tracking →</p></Link>})}</div>}</section></main>
}
