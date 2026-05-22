'use client'

import { useEffect, useState } from 'react'

interface Application {
  id: string
  title: string
  company: string
  company_domain: string
  industry: string
  province: string
  location_type: string
  salary_min?: number
  salary_max?: number
  source?: string
  job_url?: string
  status: string
  cover_letter?: string
  notes?: string
  contact_name?: string
  applied_at?: string
  next_action?: string
  next_action_date?: string
  closed_reason?: string
  match_score?: number
  created_at: string
}

const COLUMNS = [
  { id: 'saved',        label: 'Saved',        color: '#0066cc', bg: 'rgba(0,102,204,0.10)' },
  { id: 'applied',      label: 'Applied',       color: '#7c3aed', bg: 'rgba(124,58,237,0.10)' },
  { id: 'followed_up',  label: 'Followed Up',   color: '#d97706', bg: 'rgba(217,119,6,0.10)' },
  { id: 'interview',    label: 'Interview',      color: '#059669', bg: 'rgba(5,150,105,0.10)' },
  { id: 'offer',        label: 'Offer',          color: '#dc2626', bg: 'rgba(220,38,38,0.10)' },
  { id: 'closed',       label: 'Closed',         color: 'rgba(12,44,82,0.40)', bg: 'rgba(12,44,82,0.06)' },
]

const NEXT_STATUS: Record<string, string> = {
  saved: 'applied', applied: 'followed_up', followed_up: 'interview', interview: 'offer', offer: 'closed',
}

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 16 }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'

const INDUSTRY_ICONS: Record<string, string> = { Aerospace: '✈️', IT: '💻', Trucking: '🚛', Drone: '🛸', Business: '📊' }

function daysSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.floor(diff / 86400000)
}

interface AddCardModalProps {
  onSave: (card: Partial<Application>) => void
  onClose: () => void
}

function AddCardModal({ onSave, onClose }: AddCardModalProps) {
  const [form, setForm] = useState({ title: '', company: '', industry: 'Aerospace', province: 'ON', location_type: 'onsite', job_url: '', source: 'LinkedIn', salary_min: '', salary_max: '' })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const industries = ['Aerospace', 'IT', 'Trucking', 'Drone', 'Business']
  const provinces  = ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'Remote']
  const sources    = ['LinkedIn', 'Indeed', 'Adzuna', 'Company Site', 'Referral', 'Other']

  function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <div><p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: I1d }}>{label}</p>{children}</div>
  }

  const inputStyle = { background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.15)', borderRadius: 10, padding: '8px 12px', color: I1, fontSize: 13, width: '100%' }
  const selectStyle = { ...inputStyle, cursor: 'pointer' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(4px)' }}>
      <div style={{ ...G1, background: 'rgba(255,255,255,0.88)', padding: 28, width: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[16px] font-bold" style={{ color: I1 }}>Add Application</p>
          <button onClick={onClose}><span className="material-symbols-outlined" style={{ color: I1d, fontSize: 22 }}>close</span></button>
        </div>
        <div className="flex flex-col gap-4">
          <Field label="Job Title *">
            <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Aircraft Maintenance Engineer" />
          </Field>
          <Field label="Company *">
            <input style={inputStyle} value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Bombardier" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Industry">
              <select style={selectStyle} value={form.industry} onChange={e => set('industry', e.target.value)}>
                {industries.map(i => <option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Province">
              <select style={selectStyle} value={form.province} onChange={e => set('province', e.target.value)}>
                {provinces.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Work Type">
              <select style={selectStyle} value={form.location_type} onChange={e => set('location_type', e.target.value)}>
                {['onsite', 'hybrid', 'remote'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Source">
              <select style={selectStyle} value={form.source} onChange={e => set('source', e.target.value)}>
                {sources.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Job URL">
            <input style={inputStyle} value={form.job_url} onChange={e => set('job_url', e.target.value)} placeholder="https://..." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Salary Min ($)">
              <input style={inputStyle} type="number" value={form.salary_min} onChange={e => set('salary_min', e.target.value)} placeholder="80000" />
            </Field>
            <Field label="Salary Max ($)">
              <input style={inputStyle} type="number" value={form.salary_max} onChange={e => set('salary_max', e.target.value)} placeholder="110000" />
            </Field>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave({
              ...form,
              salary_min: form.salary_min ? parseInt(form.salary_min) : undefined,
              salary_max: form.salary_max ? parseInt(form.salary_max) : undefined,
            })}
            disabled={!form.title || !form.company}
            className="flex-1 py-2.5 rounded-xl font-bold text-[13px]"
            style={{ background: '#0066cc', color: '#fff', opacity: !form.title || !form.company ? 0.5 : 1 }}
          >
            Add to Kanban
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-[13px]" style={{ background: 'rgba(12,44,82,0.08)', color: I1 }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function Kanban() {
  const [apps, setApps]       = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [movingId, setMovingId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res  = await fetch('/api/jobs/applications')
    const data = await res.json()
    setApps(data.applications ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function moveCard(id: string, newStatus: string) {
    setMovingId(id)
    await fetch('/api/jobs/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    })
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
    setMovingId(null)
  }

  async function deleteCard(id: string) {
    if (!confirm('Remove this application?')) return
    await fetch(`/api/jobs/applications?id=${id}`, { method: 'DELETE' })
    setApps(prev => prev.filter(a => a.id !== id))
  }

  async function addCard(card: Partial<Application>) {
    const res  = await fetch('/api/jobs/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    })
    const data = await res.json()
    if (data.application) setApps(prev => [data.application, ...prev])
    setShowAdd(false)
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><p style={{ color: I1c }}>Loading pipeline…</p></div>

  const byStatus = (status: string) => apps.filter(a => a.status === status)

  return (
    <div className="flex-1 flex flex-col gap-4" style={{ minHeight: 0 }}>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold" style={{ color: I1 }}>{apps.length} applications in pipeline</p>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
          style={{ background: '#0066cc', color: '#fff' }}
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Application
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
        {COLUMNS.map(col => {
          const cards = byStatus(col.id)
          return (
            <div key={col.id} style={{ minWidth: 240, maxWidth: 260, flexShrink: 0 }}>
              {/* Column header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: col.color }}>{col.label}</p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: col.bg, color: col.color }}>{cards.length}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                {cards.map(app => {
                  const days    = daysSince(app.applied_at ?? app.created_at)
                  const overdue = app.next_action_date && new Date(app.next_action_date) < new Date()
                  return (
                    <div key={app.id} style={{ ...G1, padding: '12px 14px', opacity: movingId === app.id ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                      {/* Industry + age */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px]">{INDUSTRY_ICONS[app.industry] ?? '🏢'} <span className="text-[10px] font-medium" style={{ color: I1d }}>{app.industry}</span></span>
                        <span className="text-[10px]" style={{ color: I1d }}>{days}d ago</span>
                      </div>

                      <p className="text-[13px] font-bold leading-tight" style={{ color: I1 }}>{app.title}</p>
                      <p className="text-[11px] font-semibold mt-0.5" style={{ color: I1c }}>{app.company}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: I1d }}>📍 {app.province} · {app.location_type}</p>

                      {app.salary_min && (
                        <p className="text-[10px] font-semibold mt-1" style={{ color: '#059669' }}>
                          ${(app.salary_min / 1000).toFixed(0)}k – ${((app.salary_max ?? app.salary_min) / 1000).toFixed(0)}k
                        </p>
                      )}

                      {app.next_action && (
                        <div className="mt-2 px-2 py-1 rounded-lg" style={{ background: overdue ? 'rgba(220,38,38,0.10)' : 'rgba(12,44,82,0.06)' }}>
                          <p className="text-[10px] font-semibold" style={{ color: overdue ? '#dc2626' : I1c }}>
                            {overdue ? '⚠️ ' : '→ '}{app.next_action}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        {NEXT_STATUS[app.status] && (
                          <button
                            onClick={() => moveCard(app.id, NEXT_STATUS[app.status])}
                            disabled={movingId === app.id}
                            className="flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all"
                            style={{ background: col.bg, color: col.color, border: `1px solid ${col.color}30` }}
                          >
                            Move to {COLUMNS.find(c => c.id === NEXT_STATUS[app.status])?.label}
                          </button>
                        )}
                        {app.job_url && (
                          <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 rounded-lg flex items-center" style={{ background: 'rgba(0,102,204,0.10)' }}>
                            <span className="material-symbols-outlined text-[14px]" style={{ color: '#0066cc' }}>open_in_new</span>
                          </a>
                        )}
                        <button onClick={() => deleteCard(app.id)} className="px-2.5 py-1.5 rounded-lg flex items-center" style={{ background: 'rgba(220,38,38,0.08)' }}>
                          <span className="material-symbols-outlined text-[14px]" style={{ color: '#dc2626' }}>delete</span>
                        </button>
                      </div>
                    </div>
                  )
                })}

                {cards.length === 0 && (
                  <div className="flex items-center justify-center py-8 rounded-2xl" style={{ border: '1px dashed rgba(12,44,82,0.15)' }}>
                    <p className="text-[11px]" style={{ color: I1d }}>Empty</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showAdd && <AddCardModal onSave={addCard} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
