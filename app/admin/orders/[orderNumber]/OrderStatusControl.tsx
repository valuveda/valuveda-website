'use client'

import { useState } from 'react'

export default function OrderStatusControl({ orderNumber, currentStatus, allowed }: { orderNumber: string; currentStatus: string; allowed: string[] }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function updateStatus() {
    if (status === currentStatus) return
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/orders/status', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderNumber, status }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to update status')
      setMessage('Status updated')
    } catch (error) {
      setStatus(currentStatus)
      setMessage(error instanceof Error ? error.message : 'Unable to update status')
    } finally {
      setSaving(false)
    }
  }

  return <div className="flex flex-wrap items-center gap-3">
    <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={saving} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">
      <option value={currentStatus}>{currentStatus}</option>
      {allowed.map((value) => <option key={value} value={value}>{value}</option>)}
    </select>
    <button onClick={updateStatus} disabled={saving || status === currentStatus} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#101d18] disabled:opacity-40">
      {saving ? 'Saving…' : 'Update status'}
    </button>
    {message && <span className="text-xs text-white/55">{message}</span>}
  </div>
}
