'use client'

import { useEffect, useState } from 'react'

interface Application {
  id: string
  industry: string
  province: string
  status: string
  source: string
  created_at: string
  applied_at?: string
}

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18 }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const STATUS_LABEL: Record<string, string> = { saved: 'Saved', applied: 'Applied', followed_up: 'Followed Up', interview: 'Interview', offer: 'Offer', closed: 'Closed' }
const STATUS_COLOR: Record<string, string> = { saved: '#0066cc', applied: '#7c3aed', followed_up: '#d97706', interview: '#059669', offer: '#059669', closed: I1d }

function BarChart({ items, colorFn }: { items: { label: string; value: number }[]; colorFn?: (label: string) => string }) {
  const max = Math.max(...items.map(i => i.value), 1)
  return (
    <div className="flex flex-col gap-2">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-3">
          <p className="text-[11px] font-medium w-28 shrink-0" style={{ color: I1c }}>{item.label}</p>
          <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'rgba(12,44,82,0.08)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(item.value / max) * 100}%`, background: colorFn ? colorFn(item.label) : ACCENT }}
            />
          </div>
          <p className="text-[12px] font-bold w-6 text-right shrink-0" style={{ color: I1 }}>{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function KPI({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ ...G1, padding: '16px 20px' }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: I1d }}>{label}</p>
      <p className="text-[32px] font-bold leading-none" style={{ color: color ?? I1 }}>{value}</p>
      {sub && <p className="text-[11px] font-medium mt-1" style={{ color: I1d }}>{sub}</p>}
    </div>
  )
}

export default function Analytics() {
  const [apps, setApps]   = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/jobs/applications')
      .then(r => r.json())
      .then(d => { setApps(d.applications ?? []); setLoading(false) })
  }, [])

  if (loading) return <div className="flex-1 flex items-center justify-center"><p style={{ color: I1c }}>Loading analytics…</p></div>

  const total     = apps.length
  const applied   = apps.filter(a => ['applied', 'followed_up', 'interview', 'offer', 'closed'].includes(a.status)).length
  const responses = apps.filter(a => ['interview', 'offer'].includes(a.status)).length
  const offers    = apps.filter(a => a.status === 'offer').length
  const responseRate = applied > 0 ? Math.round((responses / applied) * 100) : 0

  function countBy(key: keyof Application) {
    const counts: Record<string, number> = {}
    apps.forEach(a => { const v = String(a[key]); counts[v] = (counts[v] ?? 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }))
  }

  const byIndustry = countBy('industry')
  const byProvince = countBy('province')
  const byStatus   = countBy('status')
  const bySource   = countBy('source')

  // Weekly applications (last 8 weeks)
  const weekBuckets: Record<string, number> = {}
  apps.forEach(a => {
    const d    = new Date(a.created_at)
    const week = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay())
    const key  = week.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
    weekBuckets[key] = (weekBuckets[key] ?? 0) + 1
  })
  const weeklyTrend = Object.entries(weekBuckets).slice(-8).map(([label, value]) => ({ label, value }))

  if (total === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div style={{ ...G1, padding: 48, textAlign: 'center' }}>
          <span className="material-symbols-outlined text-[48px] mb-3" style={{ color: I1d }}>bar_chart</span>
          <p className="text-[15px] font-medium" style={{ color: I1c }}>No data yet</p>
          <p className="text-[12px] mt-1" style={{ color: I1d }}>Start saving jobs and applying to see your analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPI label="Total Tracked" value={total} />
        <KPI label="Applied" value={applied} />
        <KPI label="Response Rate" value={`${responseRate}%`} sub={`${responses} response${responses !== 1 ? 's' : ''}`} color={responseRate >= 20 ? '#059669' : '#d97706'} />
        <KPI label="Offers" value={offers} color={offers > 0 ? '#059669' : I1} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div style={{ ...G1, padding: '18px 20px' }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: I1d }}>By Industry</p>
          <BarChart items={byIndustry} />
        </div>
        <div style={{ ...G1, padding: '18px 20px' }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: I1d }}>By Province</p>
          <BarChart items={byProvince} />
        </div>
        <div style={{ ...G1, padding: '18px 20px' }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: I1d }}>Pipeline Status</p>
          <BarChart items={byStatus.map(i => ({ ...i, label: STATUS_LABEL[i.label] ?? i.label }))} colorFn={label => STATUS_COLOR[Object.keys(STATUS_LABEL).find(k => STATUS_LABEL[k] === label) ?? ''] ?? ACCENT} />
        </div>
        <div style={{ ...G1, padding: '18px 20px' }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: I1d }}>By Source</p>
          <BarChart items={bySource} />
        </div>
      </div>

      {/* Weekly trend */}
      {weeklyTrend.length > 0 && (
        <div style={{ ...G1, padding: '18px 20px' }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: I1d }}>Weekly Activity</p>
          <div className="flex items-end gap-3" style={{ height: 80 }}>
            {weeklyTrend.map(w => {
              const max = Math.max(...weeklyTrend.map(x => x.value), 1)
              return (
                <div key={w.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg transition-all" style={{ height: `${(w.value / max) * 64}px`, background: ACCENT, minHeight: 4 }} />
                  <p className="text-[9px] font-medium" style={{ color: I1d }}>{w.label}</p>
                  <p className="text-[10px] font-bold" style={{ color: I1 }}>{w.value}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
