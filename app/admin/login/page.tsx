'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to sign in')
      router.replace('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in')
    } finally { setLoading(false) }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#101d18] px-5 text-white">
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[.04] p-8 shadow-2xl">
      <p className="text-xs uppercase tracking-[.25em] text-[#d8b77c]">ValuVeda Control</p>
      <h1 className="mt-2 text-3xl font-semibold">Staff sign in</h1>
      <p className="mt-2 text-sm text-white/50">Authorized staff only. Access is enforced server-side.</p>
      <label className="mt-8 block text-sm text-white/70">Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none" /></label>
      <label className="mt-4 block text-sm text-white/70">Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none" /></label>
      {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      <button disabled={loading} className="mt-6 w-full rounded-xl bg-[#d8b77c] px-4 py-3 font-semibold text-[#101d18] disabled:opacity-50">{loading ? 'Signing in…' : 'Sign in'}</button>
    </form>
  </main>
}
