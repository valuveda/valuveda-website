'use client'

import { useState } from 'react'

const OPTIONS = ['VERIFIED', 'REJECTED', 'CUSTOMER_UNREACHABLE'] as const

export default function CodVerificationControl({ orderNumber, currentStatus }: { orderNumber: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function updateStatus() {
    if (status === currentStatus || status === 'NOT_REQUIRED') return
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/orders/cod', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderNumber, status }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to update COD verification')
      setMessage('COD verification updated')
      window.location.reload()
    } catch (error) {
      setStatus(currentStatus)
      setMessage(error instanceof Error ? error.message : 'Unable to update COD verification')
    } finally {
      setSaving(false)
    }
  }

  return <div className="mt-4 flex flex-wrap items-center gap-3">
    <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={saving} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">
      <option value="PENDING">PENDING</option>
      {OPTIONS.map((value) => <option key={value} value={value}>{value}</option>)}
    </select>
    <button onClick={updateStatus} disabled={saving || status === currentStatus || status === 'PENDING'} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#101d18] disabled:opacity-40">
      {saving ? 'Saving…' : 'Update COD'}
    </button>
    {message && <span className="text-xs text-white/55">{message}</span>}
  </div>
}
