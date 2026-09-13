import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/src/lib/db'
import { readStaffSession, STAFF_COOKIE_NAME } from '@/src/lib/staff-auth'

const modules = [
  ['Orders', 'Manage order lifecycle, payment and shipment status.', '/admin/orders'],
  ['Inventory', 'Track stock by branch and reserve quantities.', '/admin/inventory'],
  ['Products', 'Manage catalog, pricing and product media.', '/admin/products'],
  ['Customers', 'Customer profiles, addresses and order history.', '/admin/customers'],
  ['Coupons', 'Server-side discount rules and campaign controls.', '/admin/coupons'],
  ['Shipping', 'Manage shipping providers and tracking.', '/admin/shipping'],
  ['Payments', 'Monitor payment state and reconciliation.', '/admin/payments'],
  ['Staff & Roles', 'Admin, branch manager and employee permissions.', '/admin/staff'],
]

export default async function AdminPage() {
  const session = readStaffSession((await cookies()).get(STAFF_COOKIE_NAME)?.value)
  if (!session) redirect('/admin/login')
  const staff = await db.staffUser.findUnique({
    where: { id: session.staffUserId },
    select: { name: true, email: true, status: true, branchId: true, roles: { select: { role: { select: { name: true } } } } },
  })
  if (!staff || staff.status !== 'ACTIVE') redirect('/admin/login')
  const roleNames = staff.roles.map(({ role }) => role.name)
  const elevated = roleNames.includes('SUPER_ADMIN') || roleNames.includes('ADMIN')
  const branchFilter = staff.branchId && !elevated ? { items: { some: { variant: { inventory: { some: { branchId: staff.branchId } } } } } } : undefined
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const [todayOrders, revenue, lowStock, pendingDispatch] = await Promise.all([
    db.order.count({ where: { createdAt: { gte: start }, ...branchFilter } }),
    db.order.aggregate({ where: { createdAt: { gte: start }, status: { not: 'CANCELLED' }, ...branchFilter }, _sum: { grandTotal: true } }),
    db.inventory.count({ where: { ...(staff.branchId && !elevated ? { branchId: staff.branchId } : {}), quantity: { lte: db.inventory.fields.reorderLevel } } }),
    db.order.count({ where: { status: { in: ['CONFIRMED', 'PROCESSING', 'PACKED'] }, ...branchFilter } }),
  ])

  const metrics = [
    ['Today orders', String(todayOrders)],
    ['Revenue', `₹${Number(revenue._sum.grandTotal ?? 0).toLocaleString('en-IN')}`],
    ['Low stock', String(lowStock)],
    ['Pending dispatch', String(pendingDispatch)],
  ]

  return <main className="min-h-screen bg-[#101d18] text-white">
    <header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8"><div><p className="text-xs uppercase tracking-[.25em] text-[#d8b77c]">ValuVeda Control</p><h1 className="mt-1 text-2xl font-semibold">Admin Dashboard</h1><p className="mt-1 text-sm text-white/45">{staff.name} · {roleNames.join(', ')}{staff.branchId ? ' · Branch assigned' : ''}</p></div><div className="flex gap-3"><Link href="/" className="rounded-full border border-white/15 px-5 py-2 text-sm">Storefront</Link><form action="/api/admin/auth/logout" method="post"><button className="rounded-full border border-white/15 px-5 py-2 text-sm">Sign out</button></form></div></div></header>
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(([label,value]) => <div key={label} className="rounded-2xl bg-white/5 p-6"><p className="text-sm text-white/50">{label}</p><strong className="mt-3 block text-3xl">{value}</strong></div>)}</div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{modules.map(([name,desc,href]) => <article key={name} className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><span className="text-xs text-[#d8b77c]">CONTROL MODULE</span><h2 className="mt-4 text-xl font-semibold">{name}</h2><p className="mt-2 text-sm leading-6 text-white/55">{desc}</p><Link href={href} className="mt-6 inline-block rounded-full border border-white/10 px-4 py-2 text-sm text-white/75">Open module</Link></article>)}</div>
    </section>
  </main>
}
