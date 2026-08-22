import Link from 'next/link'

const modules = [
  ['Orders','Manage order lifecycle, payment and shipment status.'],
  ['Inventory','Track stock by branch and reserve quantities.'],
  ['Products','Manage catalog, pricing and product media.'],
  ['Customers','Customer profiles, addresses and order history.'],
  ['Coupons','Server-side discount rules and campaign controls.'],
  ['Shipping','Manage pluggable shipping providers and tracking.'],
  ['Payments','Monitor payment state and reconciliation.'],
  ['Staff & Roles','Admin, branch manager and employee permissions.'],
]

export default function AdminPage() {
  return <main className="min-h-screen bg-[#101d18] text-white">
    <header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8"><div><p className="text-xs uppercase tracking-[.25em] text-[#d8b77c]">ValuVeda Control</p><h1 className="mt-1 text-2xl font-semibold">Admin 1</h1></div><Link href="/" className="rounded-full border border-white/15 px-5 py-2 text-sm">Storefront</Link></div></header>
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl bg-white/5 p-6"><p className="text-sm text-white/50">Today orders</p><strong className="mt-3 block text-3xl">—</strong></div><div className="rounded-2xl bg-white/5 p-6"><p className="text-sm text-white/50">Revenue</p><strong className="mt-3 block text-3xl">—</strong></div><div className="rounded-2xl bg-white/5 p-6"><p className="text-sm text-white/50">Low stock</p><strong className="mt-3 block text-3xl">—</strong></div><div className="rounded-2xl bg-white/5 p-6"><p className="text-sm text-white/50">Pending dispatch</p><strong className="mt-3 block text-3xl">—</strong></div></div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{modules.map(([name,desc])=><article key={name} className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><span className="text-xs text-[#d8b77c]">CONTROL MODULE</span><h2 className="mt-4 text-xl font-semibold">{name}</h2><p className="mt-2 text-sm leading-6 text-white/55">{desc}</p><button className="mt-6 rounded-full border border-white/10 px-4 py-2 text-sm text-white/75">Open module</button></article>)}</div>
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[.03] p-6"><h2 className="text-xl font-semibold">Security boundary</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">Admin authorization will be enforced server-side with RBAC and branch scope. Secrets, passwords, OTPs and payment credentials must never be exposed to client code or audit logs.</p></div>
    </section>
  </main>
}
