'use client'

import { useEffect, useState } from 'react'

interface Post {
  id: string
  content: string
  industry_tag: string
  venture_slug: string | null
  tone: string
  status: string
  scheduled_date: string | null
  published_at: string | null
}

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70)' }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const INDUSTRY_ICON: Record<string, string> = { Aerospace: '✈️', IT: '💻', Trucking: '🚛', Drone: '🛸', Business: '📊', Novizio: '🏢', Hourbour: '💳' }
const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  draft:     { color: I1d,      bg: 'rgba(12,44,82,0.08)'      },
  ready:     { color: '#d97706', bg: 'rgba(217,119,6,0.12)'    },
  scheduled: { color: ACCENT,   bg: 'rgba(0,102,204,0.12)'     },
  published: { color: '#059669', bg: 'rgba(5,150,105,0.12)'    },
}

const DEFAULT_DAYS = ['Mon', 'Wed', 'Fri'] // posting schedule

function getWeekDates(offset = 0) {
  const now  = new Date()
  const day  = now.getDay()
  const mon  = new Date(now)
  mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon)
    d.setDate(mon.getDate() + i)
    return d
  })
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function ContentCalendar({ onDraftDay }: { onDraftDay: (date: string) => void }) {
  const [posts, setPosts]       = useState<Post[]>([])
  const [weekOffset, setWeekOffset] = useState(0)
  const [loading, setLoading]   = useState(true)

  const weekDates = getWeekDates(weekOffset)
  const monthLabel = weekDates[0].toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })

  useEffect(() => {
    fetch('/api/content-lab/posts')
      .then(r => r.json())
      .then(d => { setPosts(d.posts ?? []); setLoading(false) })
  }, [])

  function postsForDate(date: Date) {
    const key = date.toISOString().slice(0, 10)
    return posts.filter(p => p.scheduled_date === key || p.published_at?.slice(0, 10) === key)
  }

  const published = posts.filter(p => p.status === 'published').length
  const scheduled = posts.filter(p => p.status === 'scheduled').length
  const drafts    = posts.filter(p => p.status === 'draft' || p.status === 'ready').length

  return (
    <div className="flex flex-col gap-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Published', value: published, color: '#059669' },
          { label: 'Scheduled', value: scheduled, color: ACCENT    },
          { label: 'Drafts',    value: drafts,    color: '#d97706' },
        ].map(s => (
          <div key={s.label} style={{ ...G1, padding: '14px 18px' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: I1d }}>{s.label}</p>
            <p className="text-[28px] font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{ ...G1, padding: '20px 24px' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[15px] font-bold" style={{ color: I1 }}>{monthLabel}</p>
          <div className="flex gap-2">
            <button onClick={() => setWeekOffset(w => w - 1)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(12,44,82,0.08)' }}>
              <span className="material-symbols-outlined text-[18px]" style={{ color: I1c }}>chevron_left</span>
            </button>
            <button onClick={() => setWeekOffset(0)} className="px-3 h-8 rounded-xl text-[11px] font-bold transition-all" style={{ background: 'rgba(12,44,82,0.08)', color: I1c }}>Today</button>
            <button onClick={() => setWeekOffset(w => w + 1)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(12,44,82,0.08)' }}>
              <span className="material-symbols-outlined text-[18px]" style={{ color: I1c }}>chevron_right</span>
            </button>
          </div>
        </div>

        {/* 7-day grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {weekDates.map((date, i) => {
            const label      = WEEKDAY_LABELS[i]
            const dayPosts   = postsForDate(date)
            const isToday    = date.toDateString() === new Date().toDateString()
            const isPostDay  = DEFAULT_DAYS.includes(label)
            const dateStr    = date.toISOString().slice(0, 10)

            return (
              <div key={i} className="flex flex-col gap-2">
                {/* Day header */}
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isPostDay ? ACCENT : I1d }}>{label}</p>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-1" style={{ background: isToday ? ACCENT : 'transparent' }}>
                    <p className="text-[12px] font-bold" style={{ color: isToday ? '#fff' : I1 }}>{date.getDate()}</p>
                  </div>
                </div>

                {/* Post slot */}
                <div
                  className="rounded-xl min-h-[80px] p-2 flex flex-col gap-1.5 transition-all cursor-pointer"
                  style={{ background: isPostDay ? 'rgba(0,102,204,0.05)' : 'rgba(12,44,82,0.03)', border: `1px dashed ${isPostDay ? 'rgba(0,102,204,0.20)' : 'rgba(12,44,82,0.10)'}` }}
                  onClick={() => isPostDay && onDraftDay(dateStr)}
                >
                  {dayPosts.map(p => {
                    const sc = STATUS_COLOR[p.status] ?? STATUS_COLOR.draft
                    return (
                      <div key={p.id} className="rounded-lg px-2 py-1.5" style={{ background: sc.bg }}>
                        <p className="text-[10px] font-bold leading-tight" style={{ color: sc.color }}>
                          {INDUSTRY_ICON[p.industry_tag] ?? '📝'} {p.industry_tag}
                        </p>
                        <p className="text-[10px] leading-tight mt-0.5" style={{ color: I1c, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          {p.content.slice(0, 40)}…
                        </p>
                      </div>
                    )
                  })}
                  {dayPosts.length === 0 && isPostDay && (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]" style={{ color: 'rgba(0,102,204,0.30)' }}>add</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-[11px] mt-4" style={{ color: I1d }}>
          💡 Mon · Wed · Fri are your default posting days. Click a slot to draft a post for that day.
        </p>
      </div>
    </div>
  )
}
