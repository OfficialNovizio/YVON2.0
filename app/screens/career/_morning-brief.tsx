'use client'

import { useCallback, useEffect, useState } from 'react'

interface DailyAction {
  priority: number
  category: 'network' | 'career' | 'content' | 'venture' | 'other'
  action: string
  reason: string
  urgency: 'high' | 'medium' | 'low'
}

interface TodayBrief {
  actions: DailyAction[]
  context_summary: string
  stats: {
    overdue_followups: number
    active_interviews: number
    posts_this_week: number
    contacts_going_cold: number
  }
  generated_at: string
}

interface Goal {
  id: string
  week_start: string
  goal: string
  completed: boolean
  created_at: string
}

interface FollowupContact {
  id: string
  name: string
  title: string | null
  company: string | null
  industry_tag: string | null
  next_action: string | null
  next_action_date: string
  relationship_type: string
}

const G1 = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(32px) saturate(160%)',
  WebkitBackdropFilter: 'blur(32px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.55)',
  borderRadius: 18,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70), 0 8px 32px -8px rgba(12,44,82,0.12)',
}
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const CAT_STYLE: Record<string, { bg: string; color: string; icon: string; label: string }> = {
  network: { bg: 'rgba(5,150,105,0.12)',  color: '#059669', icon: 'group',         label: 'Network' },
  career:  { bg: 'rgba(0,102,204,0.10)',  color: ACCENT,    icon: 'work',           label: 'Career'  },
  content: { bg: 'rgba(124,58,237,0.10)', color: '#7c3aed', icon: 'edit_note',      label: 'Content' },
  venture: { bg: 'rgba(217,119,6,0.10)',  color: '#d97706', icon: 'rocket_launch',  label: 'Venture' },
  other:   { bg: 'rgba(12,44,82,0.08)',   color: I1d,       icon: 'task_alt',       label: 'Task'    },
}

const URGENCY: Record<string, { color: string; label: string }> = {
  high:   { color: '#dc2626', label: '● Urgent'    },
  medium: { color: '#d97706', label: '● Today'     },
  low:    { color: '#059669', label: '● This Week' },
}

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })
}

function getWeekStart() {
  const d   = new Date()
  const day = d.getDay()
  const mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day + (day === 0 ? -6 : 1))
  return mon.toISOString().slice(0, 10)
}

function getWeekLabel() {
  const start = new Date(getWeekStart() + 'T12:00:00')
  const end   = new Date(start); end.setDate(end.getDate() + 6)
  const fmt   = (d: Date) => d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}`
}

function daysUntil(dateStr: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.round((new Date(dateStr).getTime() - today.getTime()) / 86_400_000)
}

// ── Today ─────────────────────────────────────────────────────────────────────
function TodayTab() {
  const [brief, setBrief]     = useState<TodayBrief | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const generate = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/morning-brief/today', { method: 'POST' })
      const data = await res.json() as TodayBrief & { error?: string }
      if (data.error) { setError(data.error); return }
      setBrief(data)
    } catch {
      setError('Failed to generate brief — check your API key and database connection')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { generate() }, [generate])

  const stats = brief?.stats

  return (
    <div className="flex flex-col gap-4">

      {/* Dark glass header */}
      <div style={{
        background: 'rgba(8,16,36,0.72)',
        backdropFilter: 'blur(32px) saturate(160%)',
        WebkitBackdropFilter: 'blur(32px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 18,
        padding: '28px 32px',
        boxShadow: '0 20px 40px -16px rgba(0,0,0,0.40)',
      }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[12px] font-semibold mb-1.5" style={{ color: 'rgba(220,228,248,0.45)' }}>
              {getFormattedDate()}
            </p>
            <h2 className="text-[34px] font-black leading-none" style={{ color: '#ffffff' }}>
              {getGreeting()}<span style={{ color: ACCENT }}>.</span>
            </h2>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold shrink-0"
            style={{
              background: 'rgba(0,102,204,0.20)',
              color: 'rgba(147,197,253,1)',
              border: '1px solid rgba(0,102,204,0.30)',
            }}
          >
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
            >
              refresh
            </span>
            {loading ? 'Generating…' : 'Refresh Brief'}
          </button>
        </div>

        {brief?.context_summary && (
          <p className="text-[13px] leading-relaxed mb-4 max-w-xl" style={{ color: 'rgba(220,228,248,0.65)' }}>
            {brief.context_summary}
          </p>
        )}

        {/* Quick stat strip */}
        {stats && (
          <div
            className="flex gap-6 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            {([
              { label: 'Overdue follow-ups',  value: stats.overdue_followups,   icon: 'reply',      alert: stats.overdue_followups > 0  },
              { label: 'Active interviews',   value: stats.active_interviews,   icon: 'work',       alert: false                         },
              { label: 'Posts this week',     value: stats.posts_this_week,     icon: 'edit_note',  alert: false                         },
              { label: 'Going cold',          value: stats.contacts_going_cold, icon: 'person_off', alert: stats.contacts_going_cold > 0 },
            ] as { label: string; value: number; icon: string; alert: boolean }[]).map((s, i, arr) => (
              <div key={s.label} className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ color: s.alert ? '#f87171' : s.value > 0 ? '#6ee7b7' : 'rgba(220,228,248,0.30)' }}
                    >
                      {s.icon}
                    </span>
                    <p
                      className="text-[22px] font-black leading-none"
                      style={{ color: s.alert ? '#f87171' : s.value > 0 ? '#fff' : 'rgba(220,228,248,0.40)' }}
                    >
                      {s.value}
                    </p>
                  </div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'rgba(220,228,248,0.35)' }}>
                    {s.label}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.08)', marginLeft: 12 }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action cards */}
      {loading && !brief ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="animate-pulse rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.40)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full" style={{ background: 'rgba(12,44,82,0.10)' }} />
                <div className="h-4 w-24 rounded" style={{ background: 'rgba(12,44,82,0.08)' }} />
              </div>
              <div className="h-4 w-3/4 rounded mb-2" style={{ background: 'rgba(12,44,82,0.08)' }} />
              <div className="h-3 w-1/2 rounded" style={{ background: 'rgba(12,44,82,0.06)' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ ...G1, padding: '40px', textAlign: 'center' }}>
          <span className="material-symbols-outlined text-[36px] mb-3 block" style={{ color: '#dc2626' }}>error</span>
          <p className="text-[13px] font-semibold mb-2" style={{ color: I1 }}>Could not generate brief</p>
          <p className="text-[11px] max-w-sm mx-auto" style={{ color: I1d }}>{error}</p>
        </div>
      ) : brief ? (
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-3 px-1"
            style={{ color: I1d }}
          >
            Today&apos;s 3 Focus Actions
          </p>
          <div className="flex flex-col gap-3">
            {brief.actions.map(a => {
              const cat = CAT_STYLE[a.category] ?? CAT_STYLE.other
              const urg = URGENCY[a.urgency]    ?? URGENCY.low
              return (
                <div key={a.priority} style={{ ...G1, padding: '18px 22px' }}>
                  <div className="flex items-start gap-4">
                    <div style={{
                      width: 38, height: 38, borderRadius: 999, flexShrink: 0,
                      background: a.urgency === 'high' ? 'rgba(220,38,38,0.12)' : a.urgency === 'medium' ? 'rgba(217,119,6,0.12)' : 'rgba(5,150,105,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="text-[17px] font-black" style={{ color: urg.color }}>{a.priority}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: cat.bg, color: cat.color }}
                        >
                          <span className="material-symbols-outlined text-[11px]">{cat.icon}</span>
                          {cat.label}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: urg.color }}>
                          {urg.label}
                        </span>
                      </div>
                      <p className="text-[14px] font-bold leading-snug mb-1.5" style={{ color: I1 }}>{a.action}</p>
                      <p className="text-[11px] leading-relaxed" style={{ color: I1c }}>{a.reason}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Goals ─────────────────────────────────────────────────────────────────────
function GoalsTab() {
  const [goals, setGoals]     = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [newGoal, setNewGoal] = useState('')
  const [adding, setAdding]   = useState(false)

  const weekStart = getWeekStart()

  const load = useCallback(async () => {
    const res  = await fetch(`/api/morning-brief/goals?week=${weekStart}`)
    const data = await res.json() as { goals: Goal[] }
    setGoals(data.goals ?? [])
    setLoading(false)
  }, [weekStart])

  useEffect(() => { load() }, [load])

  async function addGoal() {
    if (!newGoal.trim() || goals.length >= 7) return
    setAdding(true)
    await fetch('/api/morning-brief/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal: newGoal.trim(), week_start: weekStart }),
    })
    setNewGoal('')
    setAdding(false)
    load()
  }

  async function toggleGoal(id: string, completed: boolean) {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed } : g))
    await fetch('/api/morning-brief/goals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed }),
    })
  }

  async function deleteGoal(id: string) {
    setGoals(prev => prev.filter(g => g.id !== id))
    await fetch(`/api/morning-brief/goals?id=${id}`, { method: 'DELETE' })
  }

  const done  = goals.filter(g => g.completed).length
  const total = goals.length

  return (
    <div className="flex flex-col gap-4">
      {/* Header card */}
      <div style={{ ...G1, padding: '22px 26px' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[14px] font-bold" style={{ color: I1 }}>Weekly Goals</p>
            <p className="text-[11px] mt-0.5" style={{ color: I1d }}>{getWeekLabel()}</p>
          </div>
          {total > 0 && (
            <div style={{ textAlign: 'right' }}>
              <p className="text-[26px] font-black leading-none" style={{ color: done === total ? '#059669' : I1 }}>
                {done}
                <span className="text-[14px] font-bold" style={{ color: I1d }}>/{total}</span>
              </p>
              <p className="text-[10px]" style={{ color: I1d }}>completed</p>
            </div>
          )}
        </div>

        {total > 0 && (
          <div style={{ height: 5, background: 'rgba(12,44,82,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: 18 }}>
            <div style={{
              height: '100%',
              width: `${(done / total) * 100}%`,
              background: done === total ? '#059669' : ACCENT,
              borderRadius: 3,
              transition: 'width 0.4s ease',
            }} />
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={newGoal}
            onChange={e => setNewGoal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !adding && addGoal()}
            placeholder={total >= 7 ? 'Max 7 goals — focus is everything' : 'Add a goal for this week…'}
            disabled={total >= 7}
            className="flex-1 px-3 py-2.5 rounded-xl text-[13px] outline-none"
            style={{
              background: 'rgba(255,255,255,0.50)',
              border: '1px solid rgba(255,255,255,0.60)',
              color: I1,
            }}
          />
          <button
            onClick={addGoal}
            disabled={adding || !newGoal.trim() || total >= 7}
            className="px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all"
            style={{
              background: ACCENT,
              color: '#fff',
              opacity: !newGoal.trim() || total >= 7 ? 0.45 : 1,
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Goals list */}
      {loading ? (
        <div
          className="animate-pulse rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.40)' }}
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-11 rounded-xl mb-2" style={{ background: 'rgba(12,44,82,0.08)' }} />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div style={{ ...G1, padding: '52px 24px', textAlign: 'center' }}>
          <span className="material-symbols-outlined text-[40px] mb-3 block" style={{ color: I1d }}>flag</span>
          <p className="text-[13px] font-semibold" style={{ color: I1d }}>No goals for this week yet.</p>
          <p className="text-[11px] mt-1" style={{ color: I1d }}>Add 3–5 goals above to stay focused.</p>
        </div>
      ) : (
        <div style={{ ...G1, padding: '8px' }}>
          {goals.map((g, i) => (
            <div
              key={g.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl group transition-all"
              style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'transparent' }}
            >
              <button
                onClick={() => toggleGoal(g.id, !g.completed)}
                style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: g.completed ? '#059669' : 'transparent',
                  border: `2px solid ${g.completed ? '#059669' : 'rgba(12,44,82,0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                {g.completed && (
                  <span className="material-symbols-outlined text-[13px] text-white">check</span>
                )}
              </button>
              <p
                className="flex-1 text-[13px] font-medium"
                style={{
                  color: g.completed ? I1d : I1,
                  textDecoration: g.completed ? 'line-through' : 'none',
                }}
              >
                {g.goal}
              </p>
              <button
                onClick={() => deleteGoal(g.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: I1d }}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Follow-ups ────────────────────────────────────────────────────────────────
interface GroupSectionProps {
  label: string
  items: FollowupContact[]
  color: string
  bg: string
  onDone: (id: string) => void
  doneId: string | null
}

function GroupSection({ label, items, color, bg, onDone, doneId }: GroupSectionProps) {
  if (!items.length) return null
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
          {label}
        </p>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: bg, color }}
        >
          {items.length}
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map(c => {
          const diff      = daysUntil(c.next_action_date)
          const initials  = c.name.split(' ').map(n => n[0]).slice(0, 2).join('')
          return (
            <div key={c.id} style={{ ...G1, padding: '14px 18px' }} className="flex items-start gap-3">
              <div style={{
                width: 38, height: 38, borderRadius: 999, flexShrink: 0,
                background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: '#fff',
              }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold" style={{ color: I1 }}>{c.name}</p>
                {(c.title || c.company) && (
                  <p className="text-[11px]" style={{ color: I1c }}>
                    {[c.title, c.company].filter(Boolean).join(' · ')}
                  </p>
                )}
                {c.next_action && (
                  <p className="text-[11px] mt-0.5" style={{ color: I1d }}>{c.next_action}</p>
                )}
                <p className="text-[10px] font-bold mt-1" style={{ color }}>
                  {diff < 0 ? `${Math.abs(diff)}d overdue` : diff === 0 ? 'Due today' : `Due in ${diff}d`}
                </p>
              </div>
              <button
                onClick={() => onDone(c.id)}
                disabled={doneId === c.id}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all"
                style={{ background: 'rgba(5,150,105,0.10)', color: '#059669' }}
              >
                <span className="material-symbols-outlined text-[13px]">check</span>
                Done
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FollowupsTab() {
  const [contacts, setContacts] = useState<FollowupContact[]>([])
  const [loading, setLoading]   = useState(true)
  const [doneId, setDoneId]     = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/network/contacts')
      .then(r => r.json())
      .then((d: { contacts?: FollowupContact[] }) => {
        const withDates = (d.contacts ?? [])
          .filter((c: FollowupContact) => c.next_action_date)
          .sort((a: FollowupContact, b: FollowupContact) =>
            new Date(a.next_action_date).getTime() - new Date(b.next_action_date).getTime()
          )
        setContacts(withDates)
        setLoading(false)
      })
  }, [])

  async function markDone(id: string) {
    setDoneId(id)
    await fetch('/api/network/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, next_action: null, next_action_date: null }),
    })
    setContacts(prev => prev.filter(c => c.id !== id))
    setDoneId(null)
  }

  const today    = new Date(); today.setHours(0, 0, 0, 0)
  const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7)

  const overdue  = contacts.filter(c => new Date(c.next_action_date) < today)
  const thisWeek = contacts.filter(c => { const d = new Date(c.next_action_date); return d >= today && d < nextWeek })
  const upcoming = contacts.filter(c => new Date(c.next_action_date) >= nextWeek)

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl h-20"
            style={{ background: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.40)' }}
          />
        ))}
      </div>
    )
  }

  if (!contacts.length) {
    return (
      <div style={{ ...G1, padding: '56px 24px', textAlign: 'center' }}>
        <span className="material-symbols-outlined text-[44px] mb-3 block" style={{ color: '#059669' }}>
          check_circle
        </span>
        <p className="text-[14px] font-bold" style={{ color: I1 }}>All caught up!</p>
        <p className="text-[12px] mt-1" style={{ color: I1d }}>No follow-ups due — your network is healthy.</p>
      </div>
    )
  }

  return (
    <div>
      <GroupSection label="Overdue"   items={overdue}  color="#dc2626" bg="rgba(220,38,38,0.10)"  onDone={markDone} doneId={doneId} />
      <GroupSection label="Today"     items={thisWeek.filter(c => daysUntil(c.next_action_date) === 0)} color="#d97706" bg="rgba(217,119,6,0.10)" onDone={markDone} doneId={doneId} />
      <GroupSection label="This Week" items={thisWeek.filter(c => daysUntil(c.next_action_date) > 0)}  color={ACCENT}  bg="rgba(0,102,204,0.10)" onDone={markDone} doneId={doneId} />
      <GroupSection label="Upcoming"  items={upcoming} color={I1d}    bg="rgba(12,44,82,0.06)"  onDone={markDone} doneId={doneId} />
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface Props { activeSub: string }

export default function MorningBrief({ activeSub }: Props) {
  if (activeSub === 'today')     return <TodayTab />
  if (activeSub === 'goals')     return <GoalsTab />
  if (activeSub === 'followups') return <FollowupsTab />
  return null
}
