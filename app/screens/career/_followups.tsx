'use client'

import { useEffect, useState, useCallback } from 'react'
import ContactPanel from './_contact-panel'

interface Contact {
  id: string
  name: string
  title: string | null
  company: string | null
  industry_tag: string | null
  last_contacted: string | null
  next_action: string | null
  next_action_date: string | null
  relationship_type: string
  relationship_strength: string
}

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70)' }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const IND_COLOR: Record<string, string> = { Aerospace: '#0066cc', IT: '#7c3aed', Trucking: '#d97706', Drone: '#059669', Business: '#0c2c52', Other: '#6b7280' }
const IND_ICON: Record<string, string>  = { Aerospace: '✈️', IT: '💻', Trucking: '🚛', Drone: '🛸', Business: '📊', Other: '👤' }

function Avatar({ name, industry, size = 40 }: { name: string; industry: string | null; size?: number }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const bg       = IND_COLOR[industry ?? 'Other'] ?? '#6b7280'
  return (
    <div className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{ width: size, height: size, background: bg, color: '#fff', fontSize: size * 0.36 }}>
      {initials}
    </div>
  )
}

function daysRelative(dateStr: string): { days: number; label: string; color: string; bg: string } {
  const diff = Math.floor((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
  if (diff < 0) return { days: -diff, label: `${-diff}d overdue`,  color: '#dc2626', bg: 'rgba(220,38,38,0.08)'  }
  if (diff === 0) return { days: 0, label: 'due today',            color: '#d97706', bg: 'rgba(217,119,6,0.08)'  }
  return          { days: diff, label: `due in ${diff}d`,          color: ACCENT,    bg: 'rgba(0,102,204,0.06)'  }
}

type Group = { label: string; emoji: string; color: string; contacts: Contact[] }

export default function Followups() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading]   = useState(true)
  const [panelId, setPanelId]   = useState<string | null>(null)
  const [doneId, setDoneId]     = useState<string | null>(null)
  const [doneLogging, setDoneLogging] = useState(false)
  const [logNotes, setLogNotes] = useState('')

  const load = useCallback(async () => {
    const res  = await fetch('/api/network/contacts')
    const data = await res.json()
    const all  = (data.contacts ?? []) as Contact[]
    setContacts(all.filter((c: Contact) => c.next_action_date).sort((a, b) =>
      (a.next_action_date ?? '').localeCompare(b.next_action_date ?? '')
    ))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const today    = new Date().toISOString().slice(0, 10)
  const nextWeek = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)

  const groups: Group[] = [
    { label: 'Overdue',    emoji: '🔴', color: '#dc2626', contacts: contacts.filter(c => (c.next_action_date ?? '') < today) },
    { label: 'This Week',  emoji: '🟡', color: '#d97706', contacts: contacts.filter(c => (c.next_action_date ?? '') >= today && (c.next_action_date ?? '') <= nextWeek) },
    { label: 'Upcoming',   emoji: '🔵', color: ACCENT,    contacts: contacts.filter(c => (c.next_action_date ?? '') > nextWeek) },
  ]

  async function markDone(contact: Contact) {
    setDoneLogging(true)
    await fetch('/api/network/interactions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: contact.id, type: 'other', notes: logNotes || `Completed: ${contact.next_action}`, outcome: 'positive' }),
    })
    await fetch('/api/network/contacts', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: contact.id, next_action: null, next_action_date: null }),
    })
    setDoneId(null); setLogNotes('')
    setDoneLogging(false)
    load()
  }

  async function snooze(contact: Contact, days: number) {
    const newDate = new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10)
    await fetch('/api/network/contacts', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: contact.id, next_action_date: newDate }),
    })
    load()
  }

  const totalDue = contacts.filter(c => (c.next_action_date ?? '') <= nextWeek).length

  return (
    <div className="flex flex-col gap-5">
      {totalDue === 0 && !loading && (
        <div style={{ ...G1, padding: '56px 24px' }} className="flex flex-col items-center gap-4">
          <span className="text-[48px]">🎉</span>
          <p className="text-[14px] font-bold" style={{ color: I1 }}>No follow-ups due</p>
          <p className="text-[12px]" style={{ color: I1d }}>Your network is healthy — keep it up</p>
        </div>
      )}

      {groups.map(group => group.contacts.length > 0 && (
        <div key={group.label}>
          <div className="flex items-center gap-2 mb-3">
            <span>{group.emoji}</span>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: group.color }}>{group.label}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${group.color}1a`, color: group.color }}>{group.contacts.length}</span>
          </div>

          <div className="flex flex-col gap-3">
            {group.contacts.map(c => {
              const rel  = daysRelative(c.next_action_date!)
              const isDoneTarget = doneId === c.id
              return (
                <div key={c.id} style={{ ...G1, padding: '16px 20px' }}>
                  <div className="flex items-start gap-3">
                    <Avatar name={c.name} industry={c.industry_tag} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[14px] font-bold leading-tight" style={{ color: I1 }}>{c.name}</p>
                          {c.company && <p className="text-[11px]" style={{ color: I1c }}>{c.title ? `${c.title} · ` : ''}{c.company}</p>}
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0" style={{ background: rel.bg, color: rel.color }}>
                          {rel.label}
                        </span>
                      </div>
                      {c.next_action && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="material-symbols-outlined text-[14px]" style={{ color: '#d97706' }}>task_alt</span>
                          <p className="text-[12px] font-semibold" style={{ color: I1 }}>{c.next_action}</p>
                        </div>
                      )}
                      {c.industry_tag && (
                        <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${IND_COLOR[c.industry_tag] ?? '#6b7280'}1a`, color: IND_COLOR[c.industry_tag] ?? '#6b7280' }}>
                          {IND_ICON[c.industry_tag] ?? ''} {c.industry_tag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Done logging inline */}
                  {isDoneTarget && (
                    <div className="mt-3 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(12,44,82,0.08)' }}>
                      <input
                        style={{ background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.15)', borderRadius: 10, padding: '8px 12px', color: I1, fontSize: 12, width: '100%' }}
                        placeholder="Notes (optional)"
                        value={logNotes}
                        onChange={e => setLogNotes(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setDoneId(null)} className="px-3 py-1.5 rounded-xl text-[11px] font-bold" style={{ background: 'rgba(12,44,82,0.08)', color: I1 }}>Cancel</button>
                        <button onClick={() => markDone(c)} disabled={doneLogging} className="flex-1 py-1.5 rounded-xl text-[11px] font-bold" style={{ background: '#059669', color: '#fff', opacity: doneLogging ? 0.7 : 1 }}>
                          {doneLogging ? 'Logging…' : '✓ Mark Done & Log'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action row */}
                  {!isDoneTarget && (
                    <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                      <button onClick={() => { setDoneId(c.id); setLogNotes('') }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold"
                        style={{ background: 'rgba(5,150,105,0.10)', color: '#059669' }}>
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Done
                      </button>
                      <button onClick={() => snooze(c, 3)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold"
                        style={{ background: 'rgba(217,119,6,0.10)', color: '#d97706' }}>
                        <span className="material-symbols-outlined text-[14px]">snooze</span>
                        Snooze 3d
                      </button>
                      <button onClick={() => setPanelId(c.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold"
                        style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}>
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        View
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {panelId && (
        <ContactPanel contactId={panelId} onClose={() => setPanelId(null)} onUpdated={load} />
      )}
    </div>
  )
}
