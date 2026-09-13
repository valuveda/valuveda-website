'use client'

import { useState } from 'react'

const STATUSES = ['CREATED', 'AWB_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY', 'RETURNED', 'CANCELLED'] as const

export default function ShipmentControl({ orderNumber, currentStatus, awb }: { orderNumber: string; currentStatus: string; awb?: string | null }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function updateStatus() {
    if (status === currentStatus) return
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/shipments/status', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderNumber, status }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to update shipment')
      window.location.reload()
    } catch (error) {
      setStatus(currentStatus)
      setMessage(error instanceof Error ? error.message : 'Unable to update shipment')
    } finally {
      setSaving(false)
    }
  }

  return <div className="mt-4 space-y-3">
    <p className="text-sm text-white/55">AWB: {awb ?? '—'}</p>
    <div className="flex flex-wrap items-center gap-3">
      <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={saving} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">
        {status === 'NOT_CREATED' && <option value="NOT_CREATED">NOT_CREATED</option>}
        {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
      <button onClick={updateStatus} disabled={saving || status === currentStatus} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#101d18] disabled:opacity-40">{saving ? 'Saving…' : 'Update shipment'}</button>
      {message && <span className="text-xs text-white/55">{message}</span>}
    </div>
  </div>
}
