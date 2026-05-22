'use client'

import { useEffect, useState } from 'react'

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
}

interface Interaction {
  id: string
  contact_id: string
  interaction_date: string
  type: string
  notes: string | null
  outcome: string | null
  created_at: string
}

const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const IND_COLOR: Record<string, string> = {
  Aerospace: '#0066cc', IT: '#7c3aed', Trucking: '#d97706',
  Drone: '#059669', Business: '#0c2c52', Other: '#6b7280', Entrepreneurship: '#db2777',
}
const IND_ICON: Record<string, string> = { Aerospace: '✈️', IT: '💻', Trucking: '🚛', Drone: '🛸', Business: '📊', Entrepreneurship: '🚀', Other: '👤' }
const REL_ICON: Record<string, string> = { mentor: '🎓', peer: '👥', recruiter: '💼', investor: '💰', customer: '🛒', vendor: '🏭', friend: '👋', other: '👤' }
const INT_ICON: Record<string, string> = { dm: '💬', call: '📞', coffee: '☕', email: '📧', meeting: '🤝', referral: '🌐', other: '📝' }
const INT_LABEL: Record<string, string> = { dm: 'DM', call: 'Call', coffee: 'Coffee', email: 'Email', meeting: 'Meeting', referral: 'Referral', other: 'Other' }
const OUTCOME_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  positive:        { bg: 'rgba(5,150,105,0.12)',  color: '#059669', label: '✓ Positive'     },
  neutral:         { bg: 'rgba(12,44,82,0.08)',   color: I1d,       label: '— Neutral'        },
  followup_needed: { bg: 'rgba(217,119,6,0.12)',  color: '#d97706', label: '📌 Follow-up'    },
  negative:        { bg: 'rgba(220,38,38,0.10)',  color: '#dc2626', label: '✗ Negative'      },
}

const STRENGTHS = ['weak', 'building', 'strong']
const INT_TYPES  = ['dm', 'call', 'coffee', 'email', 'meeting', 'referral', 'other']

const inputSt: React.CSSProperties = {
  background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.15)',
  borderRadius: 10, padding: '9px 12px', color: I1, fontSize: 12, width: '100%',
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
}

function Avatar44({ name, industry, last }: { name: string; industry: string | null; last: string | null }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const bg       = IND_COLOR[industry ?? 'Other'] ?? '#6b7280'
  const ds       = daysSince(last)
  const ring     = ds === null ? 'rgba(12,44,82,0.18)' : ds < 14 ? '#059669' : ds < 30 ? '#d97706' : '#dc2626'
  return (
    <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-[18px] shrink-0"
      style={{ background: bg, color: '#fff', boxShadow: `0 0 0 3px ${ring}, 0 0 0 5px rgba(255,255,255,0.9)` }}>
      {initials}
    </div>
  )
}

function StrengthDots({ strength }: { strength: string }) {
  const filled = strength === 'strong' ? 3 : strength === 'building' ? 2 : 1
  const color  = strength === 'strong' ? '#059669' : strength === 'building' ? ACCENT : I1d
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: i < filled ? color : 'rgba(12,44,82,0.15)' }} />
      ))}
    </span>
  )
}

function groupByMonth(interactions: Interaction[]): [string, Interaction[]][] {
  const map = new Map<string, Interaction[]>()
  for (const it of interactions) {
    const key = new Date(it.interaction_date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' })
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(it)
  }
  return Array.from(map.entries())
}

interface Props { contactId: string; onClose: () => void; onUpdated: () => void }

export default function ContactPanel({ contactId, onClose, onUpdated }: Props) {
  const [contact, setContact]         = useState<Contact | null>(null)
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [loading, setLoading]         = useState(true)
  const [editing, setEditing]         = useState(false)
  const [editForm, setEditForm]       = useState<Partial<Contact>>({})
  const [saving, setSaving]           = useState(false)
  const [deleting, setDeleting]       = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Log new interaction
  const [showLog, setShowLog]         = useState(false)
  const [logType, setLogType]         = useState('dm')
  const [logDate, setLogDate]         = useState(new Date().toISOString().slice(0, 10))
  const [logNotes, setLogNotes]       = useState('')
  const [logOutcome, setLogOutcome]   = useState('neutral')
  const [logging, setLogging]         = useState(false)

  // AI Message
  const [msgCtx, setMsgCtx]           = useState('')
  const [genMsg, setGenMsg]           = useState('')
  const [genLoading, setGenLoading]   = useState(false)
  const [copied, setCopied]           = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/network/contacts?id=${contactId}`).then(r => r.json()),
      fetch(`/api/network/interactions?contact_id=${contactId}`).then(r => r.json()),
    ]).then(([cd, id]) => {
      setContact(cd.contact ?? null)
      setInteractions(id.interactions ?? [])
      setLoading(false)
    })
  }, [contactId])

  async function saveEdit() {
    if (!contact) return
    setSaving(true)
    const res  = await fetch('/api/network/contacts', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: contact.id, ...editForm }),
    })
    const data = await res.json()
    if (data.contact) { setContact(data.contact); setEditing(false); onUpdated() }
    setSaving(false)
  }

  async function deleteContact() {
    setDeleting(true)
    await fetch(`/api/network/contacts?id=${contactId}`, { method: 'DELETE' })
    onUpdated()
    onClose()
  }

  async function logInteraction() {
    if (!contact) return
    setLogging(true)
    const res  = await fetch('/api/network/interactions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: contact.id, interaction_date: logDate, type: logType, notes: logNotes || null, outcome: logOutcome }),
    })
    const data = await res.json()
    if (data.interaction) {
      setInteractions(prev => [data.interaction, ...prev])
      setContact(prev => prev ? { ...prev, last_contacted: logDate > (prev.last_contacted ?? '') ? logDate : prev.last_contacted } : prev)
      setShowLog(false); setLogNotes(''); setLogType('dm'); setLogOutcome('neutral')
      onUpdated()
    }
    setLogging(false)
  }

  async function generateMessage() {
    if (!contact) return
    setGenLoading(true)
    setGenMsg('')
    const res  = await fetch('/api/network/message', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, context: msgCtx || undefined }),
    })
    const data = await res.json()
    setGenMsg(data.message ?? '')
    setGenLoading(false)
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(genMsg)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(8,16,36,0.35)' }} onClick={onClose} />
      <div className="fixed right-0 top-0 h-full z-50" style={{ width: 500, background: 'rgba(252,253,255,0.98)', borderLeft: '1px solid rgba(12,44,82,0.10)' }}>
        <div className="flex items-center justify-center h-full">
          <p style={{ color: I1d }}>Loading…</p>
        </div>
      </div>
    </>
  )

  if (!contact) return null

  const ds = daysSince(contact.last_contacted)
  const grouped = groupByMonth(interactions)
  const ef = editForm

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(8,16,36,0.40)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div className="fixed right-0 top-0 h-full z-50 flex flex-col" style={{ width: 500, background: 'rgba(252,253,255,0.98)', borderLeft: '1px solid rgba(12,44,82,0.10)', boxShadow: '-32px 0 80px rgba(12,44,82,0.18)' }}>

        {/* Header */}
        <div className="flex items-start gap-4 px-6 py-5" style={{ borderBottom: '1px solid rgba(12,44,82,0.08)', flexShrink: 0 }}>
          <Avatar44 name={contact.name} industry={contact.industry_tag} last={contact.last_contacted} />
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-bold leading-tight" style={{ color: I1 }}>{contact.name}</p>
            {contact.title   && <p className="text-[12px] mt-0.5" style={{ color: I1c }}>{contact.title}</p>}
            {contact.company && <p className="text-[11px]"       style={{ color: I1d }}>{contact.company}</p>}
            <div className="flex items-center gap-2 mt-2">
              {contact.industry_tag && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${IND_COLOR[contact.industry_tag] ?? '#6b7280'}1a`, color: IND_COLOR[contact.industry_tag] ?? '#6b7280' }}>
                  {IND_ICON[contact.industry_tag]} {contact.industry_tag}
                </span>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(12,44,82,0.08)', color: I1c }}>
                {REL_ICON[contact.relationship_type]} {contact.relationship_type}
              </span>
              <StrengthDots strength={contact.relationship_strength} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setEditing(v => !v); setEditForm({ ...contact }) }} className="px-3 py-1.5 rounded-xl text-[11px] font-bold" style={{ background: 'rgba(12,44,82,0.08)', color: I1c }}>
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(12,44,82,0.08)' }}>
              <span className="material-symbols-outlined text-[18px]" style={{ color: I1c }}>close</span>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Edit form */}
          {editing ? (
            <div className="flex flex-col gap-3 p-4 rounded-2xl" style={{ background: 'rgba(0,102,204,0.04)', border: '1px solid rgba(0,102,204,0.12)' }}>
              <div className="grid grid-cols-2 gap-3">
                <input style={inputSt} placeholder="Title" defaultValue={contact.title ?? ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                <input style={inputSt} placeholder="Company" defaultValue={contact.company ?? ''} onChange={e => setEditForm(f => ({ ...f, company: e.target.value }))} />
                <input style={inputSt} placeholder="LinkedIn URL" defaultValue={contact.linkedin_url ?? ''} onChange={e => setEditForm(f => ({ ...f, linkedin_url: e.target.value }))} />
                <input style={inputSt} placeholder="Email" defaultValue={contact.email ?? ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                <input style={inputSt} placeholder="Location" defaultValue={contact.location ?? ''} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} />
                <select style={inputSt} defaultValue={contact.relationship_strength} onChange={e => setEditForm(f => ({ ...f, relationship_strength: e.target.value }))}>
                  {STRENGTHS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <input style={inputSt} placeholder="Next action" defaultValue={contact.next_action ?? ''} onChange={e => setEditForm(f => ({ ...f, next_action: e.target.value }))} />
              <input type="date" style={inputSt} defaultValue={contact.next_action_date ?? ''} onChange={e => setEditForm(f => ({ ...f, next_action_date: e.target.value || null }))} />
              <textarea style={{ ...inputSt, resize: 'none' }} rows={2} placeholder="Notes" defaultValue={contact.notes ?? ''} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
              <button onClick={saveEdit} disabled={saving} className="w-full py-2.5 rounded-xl text-[12px] font-bold" style={{ background: ACCENT, color: '#fff', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          ) : (
            /* Contact details */
            <div className="flex flex-col gap-2">
              {[
                { icon: 'schedule', label: ds === null ? 'Never contacted' : `Last contacted ${ds} days ago`, color: ds === null ? I1d : ds < 14 ? '#059669' : ds < 30 ? '#d97706' : '#dc2626' },
                contact.linkedin_url && { icon: 'link', label: contact.linkedin_url, href: contact.linkedin_url },
                contact.email        && { icon: 'email', label: contact.email },
                contact.location     && { icon: 'location_on', label: contact.location },
                contact.how_met      && { icon: 'handshake', label: `Met via ${contact.how_met}` },
                contact.next_action  && { icon: 'task_alt', label: `Next: ${contact.next_action}${contact.next_action_date ? ` · ${new Date(contact.next_action_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}` : ''}`, color: '#d97706' },
              ].filter(Boolean).map((row, i) => {
                const r = row as { icon: string; label: string; color?: string; href?: string }
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: r.color ?? I1d }}>{r.icon}</span>
                    {r.href
                      ? <a href={r.href} target="_blank" rel="noreferrer" className="text-[12px] underline" style={{ color: ACCENT }}>{r.label}</a>
                      : <span className="text-[12px]" style={{ color: r.color ?? I1c }}>{r.label}</span>
                    }
                  </div>
                )
              })}
              {contact.notes && (
                <div className="mt-1 p-3 rounded-xl text-[12px] leading-relaxed" style={{ background: 'rgba(12,44,82,0.04)', color: I1c }}>
                  {contact.notes}
                </div>
              )}
            </div>
          )}

          {/* AI Message Generator */}
          <div className="p-4 rounded-2xl flex flex-col gap-3" style={{ background: 'rgba(0,102,204,0.04)', border: '1px solid rgba(0,102,204,0.12)' }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]" style={{ color: ACCENT }}>auto_awesome</span>
              <p className="text-[12px] font-bold" style={{ color: I1 }}>Generate LinkedIn Message</p>
            </div>
            <input
              style={inputSt}
              placeholder="Why are you reaching out? (optional context)"
              value={msgCtx}
              onChange={e => setMsgCtx(e.target.value)}
            />
            <button
              onClick={generateMessage}
              disabled={genLoading}
              className="w-full py-2.5 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-2"
              style={{ background: ACCENT, color: '#fff', opacity: genLoading ? 0.7 : 1 }}
            >
              <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
              {genLoading ? 'Writing…' : genMsg ? 'Regenerate' : 'Generate Message'}
            </button>
            {genMsg && (
              <div className="flex flex-col gap-2">
                <textarea
                  value={genMsg}
                  onChange={e => setGenMsg(e.target.value)}
                  rows={5}
                  style={{ ...inputSt, resize: 'none', lineHeight: 1.7 }}
                />
                <button
                  onClick={copyMessage}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-bold transition-all"
                  style={{ background: copied ? 'rgba(5,150,105,0.12)' : 'rgba(12,44,82,0.08)', color: copied ? '#059669' : I1c }}
                >
                  <span className="material-symbols-outlined text-[14px]">{copied ? 'check' : 'content_copy'}</span>
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </button>
              </div>
            )}
          </div>

          {/* Interaction Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: I1d }}>Interaction Timeline</p>
              <button
                onClick={() => setShowLog(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                style={{ background: ACCENT, color: '#fff' }}
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                Log
              </button>
            </div>

            {/* Inline log form */}
            {showLog && (
              <div className="mb-4 p-4 rounded-2xl flex flex-col gap-3" style={{ background: 'rgba(0,102,204,0.04)', border: '1px solid rgba(0,102,204,0.12)' }}>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" style={inputSt} value={logDate} onChange={e => setLogDate(e.target.value)} />
                  <select style={inputSt} value={logType} onChange={e => setLogType(e.target.value)}>
                    {INT_TYPES.map(t => <option key={t} value={t}>{INT_ICON[t]} {INT_LABEL[t]}</option>)}
                  </select>
                </div>
                <textarea style={{ ...inputSt, resize: 'none' }} rows={2} placeholder="Notes (optional)" value={logNotes} onChange={e => setLogNotes(e.target.value)} />
                <div className="flex gap-1.5">
                  {['positive', 'neutral', 'followup_needed'].map(o => (
                    <button key={o} onClick={() => setLogOutcome(o)}
                      className="flex-1 py-1.5 rounded-xl text-[10px] font-bold"
                      style={{ background: logOutcome === o ? (OUTCOME_STYLE[o]?.bg ?? 'rgba(12,44,82,0.08)') : 'rgba(12,44,82,0.06)', color: logOutcome === o ? (OUTCOME_STYLE[o]?.color ?? I1) : I1c }}>
                      {OUTCOME_STYLE[o]?.label ?? o}
                    </button>
                  ))}
                </div>
                <button onClick={logInteraction} disabled={logging} className="w-full py-2 rounded-xl text-[12px] font-bold" style={{ background: ACCENT, color: '#fff', opacity: logging ? 0.7 : 1 }}>
                  {logging ? 'Logging…' : 'Log Interaction'}
                </button>
              </div>
            )}

            {interactions.length === 0 ? (
              <p className="text-[12px] py-4 text-center" style={{ color: I1d }}>No interactions logged yet</p>
            ) : (
              grouped.map(([month, items]) => (
                <div key={month} className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: I1d }}>— {month}</p>
                  <div className="flex flex-col gap-2">
                    {items.map(it => {
                      const os = OUTCOME_STYLE[it.outcome ?? 'neutral'] ?? OUTCOME_STYLE.neutral
                      return (
                        <div key={it.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(12,44,82,0.03)', border: '1px solid rgba(12,44,82,0.07)' }}>
                          <span className="text-[20px] shrink-0 mt-0.5">{INT_ICON[it.type] ?? '📝'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[11px] font-semibold" style={{ color: I1 }}>{INT_LABEL[it.type] ?? it.type}</span>
                              <span className="text-[10px]" style={{ color: I1d }}>{new Date(it.interaction_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                              {it.outcome && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: os.bg, color: os.color }}>{os.label}</span>
                              )}
                            </div>
                            {it.notes && <p className="text-[11px] leading-relaxed" style={{ color: I1c }}>{it.notes}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Delete */}
          <div className="pt-4" style={{ borderTop: '1px solid rgba(12,44,82,0.08)' }}>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className="text-[11px] font-bold" style={{ color: '#dc2626' }}>
                Delete Contact
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-[12px] font-semibold flex-1" style={{ color: '#dc2626' }}>Remove {contact.name} permanently?</p>
                <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-xl text-[11px] font-bold" style={{ background: 'rgba(12,44,82,0.08)', color: I1 }}>Cancel</button>
                <button onClick={deleteContact} disabled={deleting} className="px-3 py-1.5 rounded-xl text-[11px] font-bold" style={{ background: '#dc2626', color: '#fff' }}>
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
