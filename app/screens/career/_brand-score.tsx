'use client'

import { useEffect, useState } from 'react'

interface PostRow {
  content: string
  tone: string
  impressions: number
  likes: number
  comments: number
  published_at: string | null
}

interface BrandSummary {
  content: {
    postsLast30d: number
    postsLast60d: number
    totalImpressions: number
    totalLikes: number
    totalComments: number
    engagementRate: number
    weeklyPosts: { week: string; count: number }[]
    toneBreakdown: { tone: string; count: number; impressions: number }[]
    topPosts: PostRow[]
    score: number
  }
  network: {
    totalContacts: number
    contactsLast30d: number
    contactsLast60d: number
    interactionsLast30d: number
    strongContacts: number
    industryCount: number
    score: number
  }
  pipeline: {
    total: number
    saved: number
    applied: number
    interview: number
    offer: number
    closed: number
    appsLast30d: number
    appsLast60d: number
    avgMatchScore: number
    industryBreakdown: { industry: string; count: number }[]
    recentApps: { title: string; company: string; industry: string; status: string; applied_at: string | null }[]
    score: number
  }
  overallScore: number
  computedAt: string
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

function scoreColor(score: number, max: number) {
  const p = score / max
  if (p >= 0.75) return '#059669'
  if (p >= 0.5)  return ACCENT
  if (p >= 0.25) return '#d97706'
  return '#dc2626'
}

function scoreLabel(score: number) {
  if (score >= 75) return { label: 'Thriving', color: '#059669' }
  if (score >= 50) return { label: 'Growing',  color: ACCENT      }
  if (score >= 25) return { label: 'Building', color: '#d97706'   }
  return              { label: 'Starting', color: '#dc2626'   }
}

function ScoreRing({
  score, max, size = 140, strokeWidth = 12, children,
}: { score: number; max: number; size?: number; strokeWidth?: number; children?: React.ReactNode }) {
  const r    = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const dash = Math.min(score / max, 1) * circ
  const col  = scoreColor(score, max)
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  )
}

function MiniBar({ count, max }: { count: number; max: number }) {
  const pct = max > 0 ? Math.min((count / max) * 100, 100) : 0
  return (
    <div style={{ width: '100%', height: 6, background: 'rgba(12,44,82,0.08)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: ACCENT, borderRadius: 3, transition: 'width 0.5s ease' }} />
    </div>
  )
}

function Trend({ curr, prev, label }: { curr: number; prev: number; label: string }) {
  const delta = curr - prev
  const col   = delta > 0 ? '#059669' : delta < 0 ? '#dc2626' : I1d
  const icon  = delta > 0 ? 'trending_up' : delta < 0 ? 'trending_down' : 'remove'
  return (
    <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: col }}>
      <span className="material-symbols-outlined text-[13px]">{icon}</span>
      {delta === 0 ? `Same ${label}` : `${delta > 0 ? '+' : ''}${delta} ${label}`}
    </span>
  )
}

function WeeklyBars({ weeks }: { weeks: { week: string; count: number }[] }) {
  const max = Math.max(...weeks.map(w => w.count), 1)
  return (
    <div className="flex items-end gap-1.5" style={{ height: 64 }}>
      {weeks.map(w => (
        <div key={w.week} className="flex flex-col items-center gap-1 flex-1">
          <div style={{
            height: Math.max(Math.round((w.count / max) * 48), w.count > 0 ? 6 : 4),
            background: w.count > 0 ? ACCENT : 'rgba(12,44,82,0.10)',
            borderRadius: '4px 4px 0 0',
            width: '100%',
            transition: 'height 0.5s ease',
          }} />
          <span className="text-[9px] font-bold" style={{ color: I1d }}>{w.week}</span>
        </div>
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.40)' }}>
      <div className="h-5 w-32 rounded mb-3" style={{ background: 'rgba(12,44,82,0.10)' }} />
      {[90, 70, 55].map(w => (
        <div key={w} className="h-3 rounded mb-2" style={{ background: 'rgba(12,44,82,0.07)', width: `${w}%` }} />
      ))}
    </div>
  )
}

function timeAgo(iso: string | null): string {
  if (!iso) return '—'
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff}d ago`
}

const TONE_ICON: Record<string, string> = {
  story: '📖', insight: '💡', hot_take: '🔥', data: '📊',
  behind_scenes: '🎬', question: '❓', bridging: '🌉',
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  saved:       { bg: 'rgba(12,44,82,0.08)',   color: I1d,      label: 'Saved'     },
  applied:     { bg: 'rgba(0,102,204,0.12)',  color: ACCENT,   label: 'Applied'   },
  followed_up: { bg: 'rgba(0,102,204,0.12)',  color: ACCENT,   label: 'Followed'  },
  interview:   { bg: 'rgba(5,150,105,0.12)',  color: '#059669',label: 'Interview' },
  offer:       { bg: 'rgba(16,185,129,0.15)', color: '#10b981',label: 'Offer 🎉'  },
  closed:      { bg: 'rgba(220,38,38,0.10)',  color: '#dc2626',label: 'Closed'    },
}

interface Props { activeSub: string }

export default function BrandScore({ activeSub }: Props) {
  const [data, setData]       = useState<BrandSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/brand-score/summary')
      .then(r => r.ok ? r.json() : r.json().then((d: { error?: string }) => Promise.reject(d.error ?? `HTTP ${r.status}`)))
      .then((d: BrandSummary) => { setData(d); setLoading(false) })
      .catch((err: unknown) => {
        setError(typeof err === 'string' ? err : 'Failed to load brand data — run migration 025+026 if tables are missing')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ ...G1, padding: '56px', textAlign: 'center' }}>
        <span className="material-symbols-outlined text-[40px] mb-3 block" style={{ color: I1d }}>error</span>
        <p className="text-[13px]" style={{ color: I1d }}>{error || 'No data'}</p>
      </div>
    )
  }

  // ── Overview ──────────────────────────────────────────────────────────────
  if (activeSub === 'overview') {
    const { label: oLabel, color: oColor } = scoreLabel(data.overallScore)
    const computed = new Date(data.computedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    return (
      <div className="flex flex-col gap-5">

        {/* Hero composite score */}
        <div style={{ ...G1, padding: '28px 32px' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[14px] font-bold" style={{ color: I1 }}>Personal Brand Score</p>
              <p className="text-[11px] mt-0.5" style={{ color: I1d }}>
                Computed at {computed} · Content + Network + Pipeline
              </p>
            </div>
            <span className="px-4 py-1.5 rounded-full text-[11px] font-bold" style={{ background: `${oColor}18`, color: oColor }}>
              {oLabel}
            </span>
          </div>

          <div className="flex items-center gap-12">
            {/* Overall ring */}
            <ScoreRing score={data.overallScore} max={100} size={168} strokeWidth={14}>
              <p className="text-[40px] font-black leading-none" style={{ color: I1 }}>{data.overallScore}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: I1d }}>/ 100</p>
            </ScoreRing>

            {/* 3 dimension rings */}
            <div className="flex gap-10 flex-1 justify-around">
              {([
                { label: 'Content', score: data.content.score, max: 33, icon: 'edit_note',
                  sub1: `${data.content.postsLast30d} posts/month`, sub2: `${data.content.engagementRate}% engagement` },
                { label: 'Network', score: data.network.score, max: 33, icon: 'group',
                  sub1: `${data.network.totalContacts} contacts`, sub2: `${data.network.interactionsLast30d} interactions/mo` },
                { label: 'Pipeline', score: data.pipeline.score, max: 34, icon: 'work',
                  sub1: `${data.pipeline.applied} active apps`, sub2: `${data.pipeline.interview} interviews` },
              ] as { label: string; score: number; max: number; icon: string; sub1: string; sub2: string }[]).map(d => {
                const col = scoreColor(d.score, d.max)
                return (
                  <div key={d.label} className="flex flex-col items-center gap-3">
                    <ScoreRing score={d.score} max={d.max} size={108} strokeWidth={10}>
                      <span className="material-symbols-outlined text-[20px]" style={{ color: col }}>{d.icon}</span>
                      <p className="text-[20px] font-black leading-none mt-0.5" style={{ color: I1 }}>{d.score}</p>
                    </ScoreRing>
                    <div className="text-center">
                      <p className="text-[12px] font-bold" style={{ color: I1 }}>{d.label}</p>
                      <p className="text-[10px]" style={{ color: I1d }}>{d.max} pts max</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px]" style={{ color: I1c }}>{d.sub1}</p>
                      <p className="text-[10px]" style={{ color: I1d }}>{d.sub2}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 3 momentum cards */}
        <div className="grid grid-cols-3 gap-4">

          {/* Content momentum */}
          <div style={{ ...G1, padding: '20px 22px' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[18px]" style={{ color: ACCENT }}>edit_note</span>
              <p className="text-[12px] font-bold" style={{ color: I1 }}>Content</p>
            </div>
            <p className="text-[30px] font-black leading-none mb-0.5" style={{ color: I1 }}>{data.content.postsLast30d}</p>
            <p className="text-[11px] mb-2" style={{ color: I1d }}>posts this month</p>
            <Trend curr={data.content.postsLast30d} prev={data.content.postsLast60d} label="vs last month" />
            <div className="mt-4">
              <WeeklyBars weeks={data.content.weeklyPosts.slice(-6)} />
            </div>
          </div>

          {/* Network momentum */}
          <div style={{ ...G1, padding: '20px 22px' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[18px]" style={{ color: ACCENT }}>group</span>
              <p className="text-[12px] font-bold" style={{ color: I1 }}>Network</p>
            </div>
            <p className="text-[30px] font-black leading-none mb-0.5" style={{ color: I1 }}>{data.network.contactsLast30d}</p>
            <p className="text-[11px] mb-2" style={{ color: I1d }}>new contacts this month</p>
            <Trend curr={data.network.contactsLast30d} prev={data.network.contactsLast60d} label="vs last month" />
            <div className="mt-4 flex flex-col gap-2">
              {[
                { label: 'Strong relationships', val: data.network.strongContacts, max: Math.max(data.network.totalContacts, 1) },
                { label: 'Industries covered',   val: data.network.industryCount,  max: 6 },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px]" style={{ color: I1d }}>{r.label}</span>
                    <span className="text-[10px] font-bold" style={{ color: I1 }}>{r.val}</span>
                  </div>
                  <MiniBar count={r.val} max={r.max} />
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline momentum */}
          <div style={{ ...G1, padding: '20px 22px' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[18px]" style={{ color: ACCENT }}>work</span>
              <p className="text-[12px] font-bold" style={{ color: I1 }}>Pipeline</p>
            </div>
            <p className="text-[30px] font-black leading-none mb-0.5" style={{ color: I1 }}>{data.pipeline.appsLast30d}</p>
            <p className="text-[11px] mb-2" style={{ color: I1d }}>applications this month</p>
            <Trend curr={data.pipeline.appsLast30d} prev={data.pipeline.appsLast60d} label="vs last month" />
            <div className="mt-4 flex flex-col gap-2">
              {[
                { label: 'In interview / offer', val: data.pipeline.interview + data.pipeline.offer, max: Math.max(data.pipeline.total, 1) },
                { label: 'Avg match score',      val: data.pipeline.avgMatchScore, max: 100 },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px]" style={{ color: I1d }}>{r.label}</span>
                    <span className="text-[10px] font-bold" style={{ color: I1 }}>
                      {r.label.includes('match') ? `${r.val}%` : r.val}
                    </span>
                  </div>
                  <MiniBar count={r.val} max={r.max} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score breakdown legend */}
        <div style={{ ...G1, padding: '18px 24px' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: I1d }}>How Your Score Is Computed</p>
          <div className="flex gap-6">
            {([
              { label: 'Content Momentum',  detail: 'Post frequency · consistency · engagement rate', score: data.content.score,  max: 33 },
              { label: 'Network Velocity',  detail: 'Contacts · growth · interactions · diversity',  score: data.network.score,  max: 33 },
              { label: 'Pipeline Heat',     detail: 'Volume · stage progression · match quality',    score: data.pipeline.score, max: 34 },
            ] as { label: string; detail: string; score: number; max: number }[]).map(d => {
              const col = scoreColor(d.score, d.max)
              return (
                <div key={d.label} className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold" style={{ color: I1 }}>{d.label}</span>
                    <span className="text-[14px] font-black" style={{ color: col }}>{d.score}<span className="text-[10px] font-bold" style={{ color: I1d }}>/{d.max}</span></span>
                  </div>
                  <MiniBar count={d.score} max={d.max} />
                  <p className="text-[10px] mt-1" style={{ color: I1d }}>{d.detail}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── LinkedIn tab ──────────────────────────────────────────────────────────
  if (activeSub === 'linkedin') {
    const c = data.content
    return (
      <div className="flex flex-col gap-5">

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          {([
            { label: 'Posts Published', value: String(c.postsLast30d),                icon: 'edit_note',  sub: 'this month'               },
            { label: 'Total Impressions', value: c.totalImpressions.toLocaleString(), icon: 'visibility', sub: 'all time'                  },
            { label: 'Engagement Rate', value: `${c.engagementRate}%`,                icon: 'thumb_up',   sub: '(likes + comments) / views' },
            { label: 'Content Score', value: `${c.score}/33`,                         icon: 'verified',   sub: 'brand dimension'            },
          ] as { label: string; value: string; icon: string; sub: string }[]).map(k => (
            <div key={k.label} style={{ ...G1, padding: '18px 20px' }}>
              <span className="material-symbols-outlined text-[18px] mb-2 block" style={{ color: ACCENT }}>{k.icon}</span>
              <p className="text-[26px] font-black leading-none mb-0.5" style={{ color: I1 }}>{k.value}</p>
              <p className="text-[11px] font-semibold mb-0.5" style={{ color: I1 }}>{k.label}</p>
              <p className="text-[10px]" style={{ color: I1d }}>{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Weekly frequency chart */}
          <div style={{ ...G1, padding: '20px 22px' }}>
            <p className="text-[12px] font-bold mb-4" style={{ color: I1 }}>Post Frequency — Last 8 Weeks</p>
            <WeeklyBars weeks={c.weeklyPosts} />
            <p className="text-[10px] mt-3" style={{ color: I1d }}>
              {c.weeklyPosts.filter(w => w.count > 0).length} of 8 weeks had at least one post
            </p>
          </div>

          {/* Tone performance */}
          <div style={{ ...G1, padding: '20px 22px' }}>
            <p className="text-[12px] font-bold mb-4" style={{ color: I1 }}>Performance by Tone</p>
            {c.toneBreakdown.length === 0 ? (
              <p className="text-[12px]" style={{ color: I1d }}>No published posts yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {c.toneBreakdown.slice(0, 5).map(t => {
                  const maxImp = c.toneBreakdown[0]?.impressions ?? 1
                  return (
                    <div key={t.tone}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold" style={{ color: I1 }}>
                          {TONE_ICON[t.tone] ?? '✍️'} {t.tone.replace('_', ' ')}
                        </span>
                        <div className="flex gap-3">
                          <span className="text-[10px]" style={{ color: I1d }}>{t.count} posts</span>
                          <span className="text-[10px] font-bold" style={{ color: ACCENT }}>{t.impressions.toLocaleString()} views</span>
                        </div>
                      </div>
                      <MiniBar count={t.impressions} max={maxImp} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top posts */}
        <div style={{ ...G1, padding: '20px 24px' }}>
          <p className="text-[12px] font-bold mb-4" style={{ color: I1 }}>Top Posts by Impressions</p>
          {c.topPosts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <span className="material-symbols-outlined text-[36px]" style={{ color: I1d }}>edit_note</span>
              <p className="text-[12px]" style={{ color: I1d }}>No published posts yet — head to Content Lab to create your first post.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {c.topPosts.map((p, i) => {
                const medal = i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : '#cd7c2f'
                return (
                  <div key={i} className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.50)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black" style={{ background: medal, color: '#fff' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] leading-relaxed mb-2 overflow-hidden" style={{ color: I1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {p.content}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px]" style={{ color: I1d }}>{TONE_ICON[p.tone] ?? '✍️'} {p.tone}</span>
                        <span className="text-[10px]" style={{ color: I1d }}>👁 {(p.impressions ?? 0).toLocaleString()}</span>
                        <span className="text-[10px]" style={{ color: I1d }}>👍 {p.likes ?? 0}</span>
                        <span className="text-[10px]" style={{ color: I1d }}>💬 {p.comments ?? 0}</span>
                        {p.published_at && <span className="text-[10px]" style={{ color: I1d }}>{timeAgo(p.published_at)}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Pipeline tab ──────────────────────────────────────────────────────────
  if (activeSub === 'pipeline') {
    const p = data.pipeline
    const stages = [
      { key: 'saved',     label: 'Saved',     count: p.saved,     color: I1d       },
      { key: 'applied',   label: 'Applied',   count: p.applied,   color: ACCENT    },
      { key: 'interview', label: 'Interview', count: p.interview, color: '#059669' },
      { key: 'offer',     label: 'Offer',     count: p.offer,     color: '#10b981' },
      { key: 'closed',    label: 'Closed',    count: p.closed,    color: '#dc2626' },
    ]
    const maxStage = Math.max(p.total, 1)

    return (
      <div className="flex flex-col gap-5">

        <div className="grid grid-cols-2 gap-4">
          {/* Funnel */}
          <div style={{ ...G1, padding: '20px 24px' }}>
            <p className="text-[12px] font-bold mb-5" style={{ color: I1 }}>Application Funnel</p>
            <div className="flex flex-col gap-2.5">
              {stages.map(s => (
                <div key={s.key} className="flex items-center gap-3">
                  <span className="text-[10px] font-bold w-14 text-right shrink-0" style={{ color: I1d }}>{s.label}</span>
                  <div style={{ flex: 1, height: 28, background: 'rgba(255,255,255,0.40)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(s.count / maxStage) * 100}%`,
                      background: s.color,
                      borderRadius: 8,
                      opacity: 0.85,
                      minWidth: s.count > 0 ? 8 : 0,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                  <span className="text-[14px] font-black w-6 shrink-0" style={{ color: s.color }}>{s.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 flex gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.40)' }}>
              <div>
                <p className="text-[10px]" style={{ color: I1d }}>This month</p>
                <p className="text-[20px] font-black" style={{ color: I1 }}>{p.appsLast30d}</p>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: I1d }}>Avg match score</p>
                <p className="text-[20px] font-black" style={{ color: I1 }}>{p.avgMatchScore > 0 ? `${p.avgMatchScore}%` : '—'}</p>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: I1d }}>Pipeline score</p>
                <p className="text-[20px] font-black" style={{ color: scoreColor(p.score, 34) }}>{p.score}<span className="text-[11px]" style={{ color: I1d }}>/34</span></p>
              </div>
            </div>
            <div className="mt-2">
              <Trend curr={p.appsLast30d} prev={p.appsLast60d} label="vs last month" />
            </div>
          </div>

          {/* Industry breakdown */}
          <div style={{ ...G1, padding: '20px 24px' }}>
            <p className="text-[12px] font-bold mb-5" style={{ color: I1 }}>Applications by Industry</p>
            {p.industryBreakdown.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <span className="material-symbols-outlined text-[36px]" style={{ color: I1d }}>work</span>
                <p className="text-[12px]" style={{ color: I1d }}>No applications yet — start tracking in My Pipeline.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {p.industryBreakdown.map(ind => (
                  <div key={ind.industry}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] font-semibold" style={{ color: I1 }}>{ind.industry}</span>
                      <span className="text-[11px] font-bold" style={{ color: ACCENT }}>{ind.count}</span>
                    </div>
                    <MiniBar count={ind.count} max={p.industryBreakdown[0]?.count ?? 1} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent applications */}
        <div style={{ ...G1, padding: '20px 24px' }}>
          <p className="text-[12px] font-bold mb-4" style={{ color: I1 }}>Recent Applications</p>
          {p.recentApps.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <span className="material-symbols-outlined text-[36px]" style={{ color: I1d }}>inbox</span>
              <p className="text-[12px]" style={{ color: I1d }}>No applications tracked yet — add them in My Pipeline (Career tab).</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {p.recentApps.map((app, i) => {
                const st = STATUS_STYLE[app.status] ?? STATUS_STYLE.saved
                return (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.50)' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold truncate" style={{ color: I1 }}>{app.title}</p>
                      <p className="text-[11px]" style={{ color: I1c }}>{app.company} · {app.industry}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px]" style={{ color: I1d }}>{timeAgo(app.applied_at)}</span>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
