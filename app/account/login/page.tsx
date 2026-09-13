'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function requestOtp(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/auth/otp/request', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mobile }) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to send OTP')
      setStep('otp'); setMessage('OTP sent to your mobile number.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to send OTP') }
    finally { setBusy(false) }
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/auth/otp/verify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mobile, otp }) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Invalid OTP')
      window.location.href = '/account/orders'
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to verify OTP') }
    finally { setBusy(false) }
  }

  return <main className="min-h-screen bg-[#f6f2e9] text-[#17352a]"><header className="border-b border-[#17352a]/10"><div className="mx-auto max-w-6xl px-5 py-5"><Link href="/" className="font-semibold">ValuVeda Wellness</Link></div></header><section className="mx-auto flex min-h-[80vh] max-w-md items-center px-5 py-12"><div className="w-full rounded-3xl border border-[#17352a]/10 bg-white/75 p-7 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#8b6b3f]">Customer account</p><h1 className="mt-3 text-3xl font-semibold">{step === 'mobile' ? 'Login with mobile' : 'Verify your OTP'}</h1><p className="mt-2 text-sm text-[#17352a]/55">{step === 'mobile' ? 'Enter your Indian mobile number to continue.' : `We sent a 6-digit OTP to ${mobile}.`}</p>{step === 'mobile' ? <form onSubmit={requestOtp} className="mt-7 space-y-4"><label className="block text-sm font-medium">Mobile number<input required inputMode="tel" autoComplete="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="9876543210" className="mt-2 w-full rounded-2xl border border-[#17352a]/15 bg-white px-4 py-3 outline-none focus:border-[#17352a]" /></label><button disabled={busy} className="w-full rounded-full bg-[#17352a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Sending…' : 'Send OTP'}</button></form> : <form onSubmit={verifyOtp} className="mt-7 space-y-4"><label className="block text-sm font-medium">6-digit OTP<input required inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" className="mt-2 w-full rounded-2xl border border-[#17352a]/15 bg-white px-4 py-3 tracking-[.35em] outline-none focus:border-[#17352a]" /></label><button disabled={busy || otp.length !== 6} className="w-full rounded-full bg-[#17352a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Verifying…' : 'Verify & Continue'}</button><button type="button" onClick={() => { setStep('mobile'); setOtp(''); setMessage('') }} className="w-full text-sm text-[#17352a]/55 underline">Change mobile number</button></form>}{message && <p className="mt-5 rounded-2xl bg-[#e9e2d5] p-3 text-sm">{message}</p>}</div></section></main>
}
