'use client'

import { useEffect, useState, useCallback } from 'react'

interface Interaction {
  id: string
  contact_id: string
  interaction_date: string
  type: string
  notes: string | null
  outcome: string | null
  created_at: string
  network_contacts: {
    name: string
    title: string | null
    company: string | null
    industry_tag: string | null
  } | null
}

interface ContactOption { id: string; name: string; company: string | null }

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70)' }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const INT_ICON: Record<string, string>  = { dm: '💬', call: '📞', coffee: '☕', email: '📧', meeting: '🤝', referral: '🌐', other: '📝' }
const INT_LABEL: Record<string, string> = { dm: 'DM', call: 'Call', coffee: 'Coffee', email: 'Email', meeting: 'Meeting', referral: 'Referral', other: 'Other' }
const OUTCOME_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  positive:        { bg: 'rgba(5,150,105,0.12)',  color: '#059669', label: '✓ Positive'    },
  neutral:         { bg: 'rgba(12,44,82,0.08)',   color: I1d,       label: '— Neutral'      },
  followup_needed: { bg: 'rgba(217,119,6,0.12)',  color: '#d97706', label: '📌 Follow-up'  },
  negative:        { bg: 'rgba(220,38,38,0.10)',  color: '#dc2626', label: '✗ Negative'    },
}

const inputSt: React.CSSProperties = {
  background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.15)',
  borderRadius: 10, padding: '9px 12px', color: I1, fontSize: 12, width: '100%',
}

function formatDate(dateStr: string): string {
  const d    = new Date(dateStr)
  const now  = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })
}

function groupByDate(items: Interaction[]): [string, Interaction[]][] {
  const map = new Map<string, Interaction[]>()
  for (const it of items) {
    const key = formatDate(it.interaction_date)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(it)
  }
  return Array.from(map.entries())
}

export default function InteractionLog() {
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [contacts, setContacts]         = useState<ContactOption[]>([])
  const [loading, setLoading]           = useState(true)
  const [filterType, setFilterType]     = useState('All')
  const [showModal, setShowModal]       = useState(false)

  // Quick log modal state
  const [logContactId, setLogContactId] = useState('')
  const [logType, setLogType]           = useState('dm')
  const [logDate, setLogDate]           = useState(new Date().toISOString().slice(0, 10))
  const [logNotes, setLogNotes]         = useState('')
  const [logOutcome, setLogOutcome]     = useState('neutral')
  const [logging, setLogging]           = useState(false)

  const load = useCallback(async () => {
    const [ir, cr] = await Promise.all([
      fetch('/api/network/interactions').then(r => r.json()),
      fetch('/api/network/contacts').then(r => r.json()),
    ])
    setInteractions(ir.interactions ?? [])
    setContacts((cr.contacts ?? []).map((c: { id: string; name: string; company: string | null }) => ({ id: c.id, name: c.name, company: c.company })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = filterType === 'All'
    ? interactions
    : interactions.filter(i => i.type === filterType)

  const grouped = groupByDate(filtered)

  async function logInteraction() {
    if (!logContactId) return
    setLogging(true)
    const res  = await fetch('/api/network/interactions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: logContactId, interaction_date: logDate, type: logType, notes: logNotes || null, outcome: logOutcome }),
    })
    const data = await res.json()
    if (data.interaction) {
      setShowModal(false); setLogContactId(''); setLogNotes(''); setLogType('dm'); setLogOutcome('neutral')
      load()
    }
    setLogging(false)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div style={{ ...G1, padding: '16px 20px' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-bold" style={{ color: I1 }}>Interaction Log</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold"
            style={{ background: ACCENT, color: '#fff' }}
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Log Interaction
          </button>
        </div>

        {/* Type filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {['All', ...Object.keys(INT_ICON)].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
              style={{ background: filterType === t ? ACCENT : 'rgba(12,44,82,0.08)', color: filterType === t ? '#fff' : I1c }}>
              {INT_ICON[t] ?? ''} {t === 'All' ? 'All' : INT_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ ...G1, padding: '40px 24px' }} className="flex items-center justify-center">
          <p style={{ color: I1d }}>Loading…</p>
        </div>
      ) : grouped.length === 0 ? (
        <div style={{ ...G1, padding: '56px 24px' }} className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[48px]" style={{ color: 'rgba(0,102,204,0.25)' }}>forum</span>
          <p className="text-[14px] font-semibold" style={{ color: I1d }}>No interactions logged yet</p>
          <p className="text-[12px]" style={{ color: I1d }}>Start tracking your conversations to see patterns</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {grouped.map(([date, items]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px" style={{ background: 'rgba(12,44,82,0.10)' }} />
                <span className="text-[10px] font-bold uppercase tracking-wider px-2" style={{ color: I1d }}>{date}</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(12,44,82,0.10)' }} />
              </div>

              <div className="flex flex-col gap-2">
                {items.map(it => {
                  const contact = it.network_contacts
                  const os      = OUTCOME_STYLE[it.outcome ?? 'neutral'] ?? OUTCOME_STYLE.neutral
                  return (
                    <div key={it.id} style={{ ...G1, padding: '14px 18px' }} className="flex items-start gap-4">
                      {/* Type icon */}
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-[20px]" style={{ background: 'rgba(12,44,82,0.06)' }}>
                        {INT_ICON[it.type] ?? '📝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-[12px] font-bold" style={{ color: I1 }}>
                            {INT_LABEL[it.type] ?? it.type}
                          </span>
                          {contact && (
                            <>
                              <span className="text-[11px]" style={{ color: I1d }}>with</span>
                              <span className="text-[12px] font-semibold" style={{ color: I1 }}>{contact.name}</span>
                              {contact.company && <span className="text-[11px]" style={{ color: I1d }}>· {contact.company}</span>}
                            </>
                          )}
                          {it.outcome && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: os.bg, color: os.color }}>{os.label}</span>
                          )}
                        </div>
                        {it.notes && (
                          <p className="text-[12px] leading-relaxed mt-1" style={{ color: I1c }}>{it.notes}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Log Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(8,16,36,0.40)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-4" style={{ ...G1, padding: '28px 32px', width: 460, background: 'rgba(252,253,255,0.98)' }}>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-bold" style={{ color: I1 }}>Log Interaction</p>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(12,44,82,0.08)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: I1c }}>close</span>
                </button>
              </div>

              {/* Contact select */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: I1d }}>Contact</p>
                <select style={inputSt} value={logContactId} onChange={e => setLogContactId(e.target.value)}>
                  <option value="">Select a contact…</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.name}{c.company ? ` · ${c.company}` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: I1d }}>Date</p>
                  <input type="date" style={inputSt} value={logDate} onChange={e => setLogDate(e.target.value)} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: I1d }}>Type</p>
                  <select style={inputSt} value={logType} onChange={e => setLogType(e.target.value)}>
                    {Object.entries(INT_ICON).map(([t, icon]) => (
                      <option key={t} value={t}>{icon} {INT_LABEL[t]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: I1d }}>Notes</p>
                <textarea style={{ ...inputSt, resize: 'none', lineHeight: 1.6 }} rows={3} placeholder="What did you discuss?" value={logNotes} onChange={e => setLogNotes(e.target.value)} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: I1d }}>Outcome</p>
                <div className="flex gap-1.5">
                  {Object.entries(OUTCOME_STYLE).map(([id, s]) => (
                    <button key={id} onClick={() => setLogOutcome(id)}
                      className="flex-1 py-2 rounded-xl text-[10px] font-bold transition-all"
                      style={{ background: logOutcome === id ? s.bg : 'rgba(12,44,82,0.06)', color: logOutcome === id ? s.color : I1c, border: `1px solid ${logOutcome === id ? s.color + '40' : 'transparent'}` }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={logInteraction}
                disabled={!logContactId || logging}
                className="w-full py-3 rounded-xl text-[13px] font-bold transition-all"
                style={{ background: ACCENT, color: '#fff', opacity: !logContactId || logging ? 0.6 : 1 }}
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
