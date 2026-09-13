import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/src/lib/db'
import { readStaffSession, STAFF_COOKIE_NAME } from '@/src/lib/staff-auth'

export default async function AdminOrdersPage() {
  const session = readStaffSession((await cookies()).get(STAFF_COOKIE_NAME)?.value)
  if (!session) redirect('/admin/login')
  const staff = await db.staffUser.findUnique({
    where: { id: session.staffUserId },
    select: { name: true, status: true, branchId: true, roles: { select: { role: { select: { name: true } } } } },
  })
  if (!staff || staff.status !== 'ACTIVE') redirect('/admin/login')
  const roles = staff.roles.map((x) => x.role.name)
  const elevated = roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')
  const branchFilter = staff.branchId && !elevated ? { items: { some: { variant: { inventory: { some: { branchId: staff.branchId } } } } } } : undefined
  const orders = await db.order.findMany({
    where: branchFilter,
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      orderNumber: true, status: true, paymentStatus: true, paymentMethod: true,
      customerName: true, customerMobile: true, grandTotal: true, createdAt: true,
      items: { select: { productNameSnapshot: true, quantity: true } },
      shipments: { orderBy: { createdAt: 'desc' }, take: 1, select: { status: true, awb: true } },
    },
  })
  return <main className="min-h-screen bg-[#101d18] text-white">
    <header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"><div><Link href="/admin" className="text-sm text-white/50">← Dashboard</Link><h1 className="mt-2 text-2xl font-semibold">Orders</h1><p className="text-sm text-white/45">{orders.length} latest orders · {roles.join(', ')}</p></div><Link href="/admin/inventory" className="rounded-full border border-white/15 px-5 py-2 text-sm">Inventory</Link></div></header>
    <section className="mx-auto max-w-7xl px-5 py-8"><div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-white/5 text-white/50"><tr>{['Order','Customer','Items','Payment','Status','Shipment','Total','Date'].map((h) => <th key={h} className="px-5 py-4 font-medium">{h}</th>)}</tr></thead><tbody>{orders.map((o) => <tr key={o.orderNumber} className="border-t border-white/10"><td className="px-5 py-4 font-medium">{o.orderNumber}</td><td className="px-5 py-4"><div>{o.customerName}</div><div className="text-white/40">{o.customerMobile}</div></td><td className="px-5 py-4">{o.items.reduce((n, i) => n + i.quantity, 0)}</td><td className="px-5 py-4"><div>{o.paymentMethod}</div><div className="text-white/40">{o.paymentStatus}</div></td><td className="px-5 py-4"><span className="rounded-full bg-white/10 px-3 py-1">{o.status}</span></td><td className="px-5 py-4">{o.shipments[0]?.awb ?? o.shipments[0]?.status ?? '—'}</td><td className="px-5 py-4">₹{Number(o.grandTotal).toLocaleString('en-IN')}</td><td className="px-5 py-4 text-white/50">{o.createdAt.toLocaleString('en-IN')}</td></tr>)}{orders.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-white/40">No orders found.</td></tr>}</tbody></table></div></section>
  </main>
}
