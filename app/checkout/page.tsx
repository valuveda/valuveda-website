'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass = 'mt-2 w-full rounded-2xl border border-[#17352a]/15 bg-white px-4 py-3 outline-none focus:border-[#17352a]'

type CartItem = { id: string; variantId: string; productName: string; variantName: string; quantity: number; mrp: number; sellingPrice: number; lineTotal: number }
type Customer = { id: string; mobile: string; email: string | null }

export default function CheckoutPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [coupon, setCoupon] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD')
  const [form, setForm] = useState({ name: '', mobile: '', email: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India' })

  useEffect(() => {
    async function load() {
      try {
        const [meResponse, cartResponse] = await Promise.all([fetch('/api/auth/me'), fetch('/api/cart')])
        if (!meResponse.ok) { router.replace('/account/login'); return }
        const me = await meResponse.json()
        const cart = await cartResponse.json()
        if (!Array.isArray(cart.items) || cart.items.length === 0) { router.replace('/cart'); return }
        setCustomer(me.customer)
        setItems(cart.items)
        setForm((current) => ({ ...current, mobile: me.customer.mobile, email: me.customer.email ?? '' }))
      } catch { setMessage('Unable to load checkout. Please try again.') }
      finally { setLoading(false) }
    }
    load()
  }, [router])

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const totalMrp = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0)
  const savings = totalMrp - subtotal
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))

  async function placeOrder(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    if (!customer) { setMessage('Please login again.'); setBusy(false); return }
    try {
      const response = await fetch('/api/orders', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          customerName: form.name,
          customerMobile: form.mobile,
          customerEmail: form.email,
          shippingAddress: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country },
          paymentMethod,
          coupon: coupon.trim() || undefined,
          items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to place order')
      if (paymentMethod === 'ONLINE') {
        setMessage('Order created, but online payment setup is not available yet. Please use COD for now.')
        setBusy(false)
        return
      }
      router.replace(`/account/orders/${data.orderNumber}`)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to place order'); setBusy(false) }
  }

  if (loading) return <main className="min-h-screen bg-[#f6f2e9] p-8 text-[#17352a]">Loading checkout…</main>

  return <main className="min-h-screen bg-[#f6f2e9] text-[#17352a]"><header className="border-b border-[#17352a]/10"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><a href="/" className="font-semibold">ValuVeda Wellness</a><a href="/account/orders" className="text-sm font-medium">My Orders</a></div></header><form onSubmit={placeOrder} className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_380px]"><section className="rounded-3xl border border-[#17352a]/10 bg-white/75 p-7"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#8b6b3f]">Secure checkout</p><h1 className="mt-3 text-4xl font-semibold">Delivery details</h1><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="sm:col-span-2 text-sm font-medium">Full name<input required value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} placeholder="Your name" /></label><label className="text-sm font-medium">Mobile<input required inputMode="tel" value={form.mobile} onChange={(e) => update('mobile', e.target.value)} className={inputClass} /></label><label className="text-sm font-medium">Email <span className="font-normal text-[#17352a]/45">(optional)</span><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} placeholder="you@example.com" /></label><label className="sm:col-span-2 text-sm font-medium">Address<input required value={form.line1} onChange={(e) => update('line1', e.target.value)} className={inputClass} placeholder="House / flat, street" /></label><label className="sm:col-span-2 text-sm font-medium">Apartment / landmark <span className="font-normal text-[#17352a]/45">(optional)</span><input value={form.line2} onChange={(e) => update('line2', e.target.value)} className={inputClass} /></label><label className="text-sm font-medium">City<input required value={form.city} onChange={(e) => update('city', e.target.value)} className={inputClass} /></label><label className="text-sm font-medium">State<input required value={form.state} onChange={(e) => update('state', e.target.value)} className={inputClass} /></label><label className="text-sm font-medium">PIN code<input required inputMode="numeric" maxLength={6} value={form.postalCode} onChange={(e) => update('postalCode', e.target.value.replace(/\D/g, '').slice(0, 6))} className={inputClass} placeholder="110001" /></label><label className="text-sm font-medium">Country<input required value={form.country} onChange={(e) => update('country', e.target.value)} className={inputClass} /></label></div><div className="mt-8 border-t border-[#17352a]/10 pt-7"><h2 className="text-xl font-semibold">Payment method</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#17352a]/15 bg-white p-4"><input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="mt-1" /><span><strong>Cash on Delivery</strong><span className="mt-1 block text-sm text-[#17352a]/55">Pay when your order arrives.</span></span></label><label className="flex cursor-not-allowed items-start gap-3 rounded-2xl border border-[#17352a]/10 bg-[#f6f2e9] p-4 opacity-60"><input type="radio" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} /><span><strong>Online payment</strong><span className="mt-1 block text-sm">Temporarily unavailable — Razorpay setup pending.</span></span></label></div></div>{message && <p className="mt-6 rounded-2xl bg-[#e9e2d5] p-4 text-sm">{message}</p>}<button disabled={busy || paymentMethod !== 'COD'} className="mt-7 w-full rounded-full bg-[#17352a] px-6 py-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Placing order…' : 'Place COD order'}</button></section><aside className="h-fit rounded-3xl border border-[#17352a]/10 bg-white/75 p-7 lg:sticky lg:top-6"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#8b6b3f]">Order summary</p><div className="mt-5 space-y-4">{items.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><div><p className="font-medium">{item.productName}</p><p className="text-[#17352a]/50">{item.variantName} × {item.quantity}</p></div><span className="font-semibold">₹{item.lineTotal.toLocaleString('en-IN')}</span></div>)}</div><div className="mt-6 border-t border-[#17352a]/10 pt-5 space-y-2 text-sm"><div className="flex justify-between"><span>MRP</span><span>₹{totalMrp.toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span>Product savings</span><span>−₹{savings.toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span>Shipping</span><span>Free</span></div><div className="flex justify-between border-t border-[#17352a]/10 pt-3 text-lg font-semibold"><span>Total</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div></div><div className="mt-6"><label className="text-sm font-medium">Coupon code<input value={coupon} onChange={(e) => setCoupon(e.target.value)} className={inputClass} placeholder="Enter coupon" /></label><p className="mt-2 text-xs text-[#17352a]/45">Final discount and total are calculated securely on the server.</p></div></aside></form></main>
}
