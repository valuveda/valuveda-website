'use client'

import { useState } from 'react'

const STATUSES = ['CREATED', 'AWB_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY', 'RETURNED', 'CANCELLED'] as const

export default function ShipmentControl({ orderNumber, currentStatus, awb, trackingUrl }: { orderNumber: string; currentStatus: string; awb?: string | null; trackingUrl?: string | null }) {
  const [status, setStatus] = useState(currentStatus)
  const [awbValue, setAwbValue] = useState(awb ?? '')
  const [trackingValue, setTrackingValue] = useState(trackingUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function save() {
    if (status === currentStatus && awbValue === (awb ?? '') && trackingValue === (trackingUrl ?? '')) return
    setSaving(true); setMessage('')
    try {
      const response = await fetch('/api/admin/shipments', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderNumber, status, awb: awbValue.trim() || null, trackingUrl: trackingValue.trim() || null }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to update shipment')
      window.location.reload()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update shipment')
    } finally { setSaving(false) }
  }

  return <div className="mt-4 space-y-3">
    <div className="grid gap-3 sm:grid-cols-3">
      <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={saving} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white">
        {status === 'NOT_CREATED' && <option value="NOT_CREATED">NOT_CREATED</option>}
        {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
      <input value={awbValue} onChange={(e) => setAwbValue(e.target.value)} disabled={saving} placeholder="AWB" className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30" />
      <input value={trackingValue} onChange={(e) => setTrackingValue(e.target.value)} disabled={saving} placeholder="Tracking URL" className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30" />
    </div>
    <button onClick={save} disabled={saving} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#101d18] disabled:opacity-40">{saving ? 'Saving…' : 'Save shipment'}</button>
    {message && <span className="ml-3 text-xs text-white/55">{message}</span>}
  </div>
}
