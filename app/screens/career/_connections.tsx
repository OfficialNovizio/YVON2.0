'use client'

import { useEffect, useState, useCallback } from 'react'
import ContactPanel from './_contact-panel'

interface Contact {
  id: string
  name: string
  title: string | null
  company: string | null
  industry_tag: string | null
  linkedin_url: string | null
  email: string | null
  location: string | null
  how_met: string | null
  relationship_type: string
  relationship_strength: string
  venture_slug: string | null
  notes: string | null
  last_contacted: string | null
  next_action: string | null
  next_action_date: string | null
  created_at: string
}

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70)' }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const IND_COLOR: Record<string, string> = {
  Aerospace: '#0066cc', IT: '#7c3aed', Trucking: '#d97706',
  Drone: '#059669', Business: '#0c2c52', Other: '#6b7280', Entrepreneurship: '#db2777',
}
const IND_ICON: Record<string, string> = {
  Aerospace: '✈️', IT: '💻', Trucking: '🚛', Drone: '🛸', Business: '📊', Entrepreneurship: '🚀', Other: '👤',
}
const REL_ICON: Record<string, string> = {
  mentor: '🎓', peer: '👥', recruiter: '💼', investor: '💰',
  customer: '🛒', vendor: '🏭', friend: '👋', other: '👤',
}
const INT_ICON: Record<string, string> = {
  dm: '💬', call: '📞', coffee: '☕', email: '📧', meeting: '🤝', referral: '🌐', other: '📝',
}
const OUTCOME_STYLE: Record<string, { bg: string; color: string }> = {
  positive:        { bg: 'rgba(5,150,105,0.12)',  color: '#059669' },
  neutral:         { bg: 'rgba(12,44,82,0.08)',   color: I1d },
  followup_needed: { bg: 'rgba(217,119,6,0.12)',  color: '#d97706' },
  negative:        { bg: 'rgba(220,38,38,0.10)',  color: '#dc2626' },
}

const INDUSTRIES  = ['Aerospace', 'IT', 'Trucking', 'Drone', 'Business', 'Other']
const REL_TYPES   = ['mentor', 'peer', 'recruiter', 'investor', 'customer', 'vendor', 'friend', 'other']
const STRENGTHS   = ['weak', 'building', 'strong']
const HOW_MET_OPS = ['LinkedIn', 'Conference', 'Referral', 'Work', 'School', 'Other']

const inputSt: React.CSSProperties = {
  background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.15)',
  borderRadius: 10, padding: '9px 12px', color: I1, fontSize: 12, width: '100%',
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
}

function stalenessRing(last: string | null): string {
  const d = daysSince(last)
  if (d === null) return 'rgba(12,44,82,0.18)'
  if (d < 14)    return '#059669'
  if (d < 30)    return '#d97706'
  return '#dc2626'
}

function StrengthDots({ strength }: { strength: string }) {
  const filled = strength === 'strong' ? 3 : strength === 'building' ? 2 : 1
  const color  = strength === 'strong' ? '#059669' : strength === 'building' ? ACCENT : I1d
  return (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-2 h-2 rounded-full" style={{ background: i < filled ? color : 'rgba(12,44,82,0.15)' }} />
      ))}
    </span>
  )
}

function Avatar({ name, industry, last_contacted, size = 44 }: { name: string; industry: string | null; last_contacted: string | null; size?: number }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const bg       = IND_COLOR[industry ?? 'Other'] ?? '#6b7280'
  const ring     = stalenessRing(last_contacted)
  return (
    <div className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{ width: size, height: size, background: bg, color: '#fff', fontSize: size * 0.34, boxShadow: `0 0 0 3px ${ring}, 0 0 0 5px rgba(255,255,255,0.8)` }}>
      {initials}
    </div>
  )
}

function networkScore(contacts: Contact[]): number {
  if (!contacts.length) return 0
  const now30 = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)
  const active = contacts.filter(c => c.last_contacted && c.last_contacted >= now30).length
  const strong = contacts.filter(c => c.relationship_strength === 'strong').length
  const industries = new Set(contacts.map(c => c.industry_tag).filter(Boolean)).size
  const s =
    Math.min(contacts.length / 50, 1)     * 30 +
    (active / contacts.length)             * 30 +
    Math.min(industries / 5, 1)            * 20 +
    (strong / contacts.length)             * 20
  return Math.min(Math.round(s), 100)
}

interface QuickLogState { contactId: string; contactName: string }

export default function Connections() {
  const [contacts, setContacts]   = useState<Contact[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filterInd, setFilterInd] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterStr, setFilterStr] = useState('All')
  const [showAdd, setShowAdd]     = useState(false)
  const [panelId, setPanelId]     = useState<string | null>(null)
  const [quickLog, setQuickLog]   = useState<QuickLogState | null>(null)

  // Add form state
  const [form, setForm] = useState({
    name: '', title: '', company: '', industry_tag: 'Aerospace',
    relationship_type: 'peer', relationship_strength: 'weak',
    linkedin_url: '', how_met: 'LinkedIn', venture_slug: '', notes: '',
  })
  const [saving, setSaving] = useState(false)

  // Quick log state
  const [logType, setLogType]       = useState('dm')
  const [logNotes, setLogNotes]     = useState('')
  const [logOutcome, setLogOutcome] = useState('neutral')
  const [logging, setLogging]       = useState(false)

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (filterInd  !== 'All') params.set('industry', filterInd)
    if (filterType !== 'All') params.set('type', filterType)
    if (filterStr  !== 'All') params.set('strength', filterStr)
    if (search.trim())        params.set('search', search.trim())
    const res  = await fetch(`/api/network/contacts?${params}`)
    const data = await res.json()
    setContacts(data.contacts ?? [])
    setLoading(false)
  }, [filterInd, filterType, filterStr, search])

  useEffect(() => { load() }, [load])

  async function addContact() {
    if (!form.name.trim()) return
    setSaving(true)
    const res  = await fetch('/api/network/contacts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, venture_slug: form.venture_slug || null }),
    })
    const data = await res.json()
    if (data.contact) {
      setContacts(prev => [data.contact, ...prev])
      setForm({ name: '', title: '', company: '', industry_tag: 'Aerospace', relationship_type: 'peer', relationship_strength: 'weak', linkedin_url: '', how_met: 'LinkedIn', venture_slug: '', notes: '' })
      setShowAdd(false)
    }
    setSaving(false)
  }

  async function logInteraction() {
    if (!quickLog) return
    setLogging(true)
    await fetch('/api/network/interactions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: quickLog.contactId, type: logType, notes: logNotes || null, outcome: logOutcome }),
    })
    setQuickLog(null); setLogType('dm'); setLogNotes(''); setLogOutcome('neutral')
    setLogging(false)
    load()
  }

  // Derived stats
  const now   = new Date().toISOString().slice(0, 10)
  const now14 = new Date(Date.now() - 14 * 86_400_000).toISOString().slice(0, 10)
  const now30 = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)
  const total      = contacts.length
  const active30   = contacts.filter(c => c.last_contacted && c.last_contacted >= now30).length
  const goingCold  = contacts.filter(c => c.last_contacted && c.last_contacted < now14 && c.last_contacted >= now30).length
  const overdueFu  = contacts.filter(c => c.next_action_date && c.next_action_date < now).length
  const score      = networkScore(contacts)
  const scoreColor = score >= 70 ? '#059669' : score >= 40 ? '#d97706' : '#dc2626'

  return (
    <div className="flex flex-col gap-5">
      {/* Network Health Banner */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total',        value: total,     color: I1,       sub: 'contacts'     },
          { label: 'Active 30d',   value: active30,  color: '#059669', sub: 'engaged'     },
          { label: 'Going Cold',   value: goingCold, color: '#d97706', sub: '14-30 days'  },
          { label: 'Follow-ups',   value: overdueFu, color: '#dc2626', sub: 'overdue'     },
        ].map(s => (
          <div key={s.label} style={{ ...G1, padding: '14px 18px' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: I1d }}>{s.label}</p>
            <p className="text-[26px] font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] mt-1" style={{ color: I1d }}>{s.sub}</p>
          </div>
        ))}
        {/* Network Score */}
        <div style={{ ...G1, padding: '14px 18px' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: I1d }}>Network Score</p>
          <p className="text-[26px] font-bold leading-none" style={{ color: scoreColor }}>{score}</p>
          <div className="mt-2 h-1.5 rounded-full" style={{ background: 'rgba(12,44,82,0.10)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: scoreColor }} />
          </div>
        </div>
      </div>

      {/* Search + Filters + Add */}
      <div style={{ ...G1, padding: '16px 20px' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px]" style={{ color: I1d }}>search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name or company…"
              style={{ ...inputSt, paddingLeft: 34 }}
            />
          </div>
          <button
            onClick={() => setShowAdd(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap"
            style={{ background: ACCENT, color: '#fff' }}
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            Add Contact
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {['All', ...INDUSTRIES].map(ind => (
              <button key={ind} onClick={() => setFilterInd(ind)}
                className="px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all"
                style={{ background: filterInd === ind ? ACCENT : 'rgba(12,44,82,0.08)', color: filterInd === ind ? '#fff' : I1c }}>
                {IND_ICON[ind] ?? ''} {ind}
              </button>
            ))}
          </div>
          <div className="w-px self-stretch" style={{ background: 'rgba(12,44,82,0.12)' }} />
          {['All', ...STRENGTHS].map(s => (
            <button key={s} onClick={() => setFilterStr(s)}
              className="px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all capitalize"
              style={{ background: filterStr === s ? 'rgba(8,16,36,0.82)' : 'rgba(12,44,82,0.08)', color: filterStr === s ? '#fff' : I1c }}>
              {s}
            </button>
          ))}
        </div>

        {/* Add Contact Form */}
        {showAdd && (
          <div className="mt-4 pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(12,44,82,0.08)' }}>
            <div className="grid grid-cols-3 gap-3">
              <input style={inputSt} placeholder="Full name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input style={inputSt} placeholder="Title / Role" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <input style={inputSt} placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <select style={inputSt} value={form.industry_tag} onChange={e => setForm(f => ({ ...f, industry_tag: e.target.value }))}>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
              <select style={inputSt} value={form.relationship_type} onChange={e => setForm(f => ({ ...f, relationship_type: e.target.value }))}>
                {REL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <select style={inputSt} value={form.relationship_strength} onChange={e => setForm(f => ({ ...f, relationship_strength: e.target.value }))}>
                {STRENGTHS.map(s => <option key={s}>{s}</option>)}
              </select>
              <select style={inputSt} value={form.how_met} onChange={e => setForm(f => ({ ...f, how_met: e.target.value }))}>
                {HOW_MET_OPS.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input style={inputSt} placeholder="LinkedIn URL" value={form.linkedin_url} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} />
              <input style={inputSt} placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-[12px] font-bold" style={{ background: 'rgba(12,44,82,0.08)', color: I1 }}>Cancel</button>
              <button onClick={addContact} disabled={!form.name.trim() || saving}
                className="px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
                style={{ background: ACCENT, color: '#fff', opacity: !form.name.trim() || saving ? 0.6 : 1 }}>
                {saving ? 'Saving…' : 'Add Contact'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.28)' }} />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div style={{ ...G1, padding: '56px 24px' }} className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[48px]" style={{ color: 'rgba(0,102,204,0.25)' }}>group</span>
          <p className="text-[14px] font-semibold" style={{ color: I1d }}>No contacts yet</p>
          <p className="text-[12px]" style={{ color: I1d }}>Add your first contact to start tracking your network</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {contacts.map(c => {
            const ds         = daysSince(c.last_contacted)
            const isOverdue  = c.next_action_date && c.next_action_date < new Date().toISOString().slice(0, 10)
            return (
              <div
                key={c.id}
                className="cursor-pointer transition-all"
                style={{ ...G1, padding: '18px 20px' }}
                onClick={() => setPanelId(c.id)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <Avatar name={c.name} industry={c.industry_tag} last_contacted={c.last_contacted} size={44} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold leading-tight" style={{ color: I1 }}>{c.name}</p>
                    {c.title && <p className="text-[11px] mt-0.5" style={{ color: I1c }}>{c.title}</p>}
                    {c.company && <p className="text-[11px]" style={{ color: I1d }}>{c.company}</p>}
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  {c.industry_tag && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${IND_COLOR[c.industry_tag] ?? '#6b7280'}1a`, color: IND_COLOR[c.industry_tag] ?? '#6b7280' }}>
                      {IND_ICON[c.industry_tag] ?? ''} {c.industry_tag}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(12,44,82,0.08)', color: I1c }}>
                    {REL_ICON[c.relationship_type] ?? ''} {c.relationship_type}
                  </span>
                  <StrengthDots strength={c.relationship_strength} />
                </div>

                {/* Last contact + next action */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px]" style={{ color: ds === null ? I1d : ds < 14 ? '#059669' : ds < 30 ? '#d97706' : '#dc2626' }}>
                    {ds === null ? 'Never contacted' : `Last: ${ds}d ago`}
                  </span>
                  {c.next_action && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[140px]" style={{ background: isOverdue ? 'rgba(220,38,38,0.10)' : 'rgba(217,119,6,0.10)', color: isOverdue ? '#dc2626' : '#d97706' }}>
                      {isOverdue ? '⚠ ' : '📌 '}{c.next_action}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => { setQuickLog({ contactId: c.id, contactName: c.name }); setLogType('dm'); setLogNotes(''); setLogOutcome('neutral') }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all"
                    style={{ background: 'rgba(12,44,82,0.08)', color: I1c }}
                  >
                    <span className="material-symbols-outlined text-[14px]">add_circle</span>
                    Log
                  </button>
                  <button
                    onClick={() => setPanelId(c.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all"
                    style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}
                  >
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    Message
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Contact Panel */}
      {panelId && (
        <ContactPanel
          contactId={panelId}
          onClose={() => setPanelId(null)}
          onUpdated={load}
        />
      )}

      {/* Quick Log Modal */}
      {quickLog && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(8,16,36,0.35)', backdropFilter: 'blur(4px)' }} onClick={() => setQuickLog(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-4" style={{ ...G1, padding: '24px 28px', width: 420, background: 'rgba(252,253,255,0.98)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: I1d }}>Log Interaction</p>
                  <p className="text-[14px] font-bold" style={{ color: I1 }}>{quickLog.contactName}</p>
                </div>
                <button onClick={() => setQuickLog(null)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(12,44,82,0.08)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: I1c }}>close</span>
                </button>
              </div>

              {/* Type picker */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: I1d }}>Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(INT_ICON).map(([type, icon]) => (
                    <button key={type} onClick={() => setLogType(type)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all capitalize"
                      style={{ background: logType === type ? ACCENT : 'rgba(12,44,82,0.08)', color: logType === type ? '#fff' : I1c }}>
                      {icon} {type}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={logNotes}
                onChange={e => setLogNotes(e.target.value)}
                placeholder="Notes (optional)"
                rows={3}
                style={{ ...inputSt, resize: 'none', lineHeight: 1.6 }}
              />

              {/* Outcome */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: I1d }}>Outcome</p>
                <div className="flex gap-1.5">
                  {[
                    { id: 'positive', label: '✓ Positive' },
                    { id: 'neutral',  label: '— Neutral'  },
                    { id: 'followup_needed', label: '📌 Follow-up' },
                  ].map(o => (
                    <button key={o.id} onClick={() => setLogOutcome(o.id)}
                      className="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all"
                      style={{ background: logOutcome === o.id ? (OUTCOME_STYLE[o.id]?.bg ?? 'rgba(12,44,82,0.08)') : 'rgba(12,44,82,0.06)', color: logOutcome === o.id ? (OUTCOME_STYLE[o.id]?.color ?? I1) : I1c, border: `1px solid ${logOutcome === o.id ? (OUTCOME_STYLE[o.id]?.color ?? 'transparent') + '40' : 'transparent'}` }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={logInteraction}
                disabled={logging}
                className="w-full py-3 rounded-xl text-[13px] font-bold transition-all"
                style={{ background: ACCENT, color: '#fff', opacity: logging ? 0.7 : 1 }}
              >
                {logging ? 'Logging…' : 'Log Interaction'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
