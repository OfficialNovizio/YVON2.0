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
  impressions: number | null
  likes: number | null
  comments: number | null
  shares: number | null
  linkedin_post_id: string | null
}

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70)' }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const TONE_ICONS: Record<string, string> = {
  story: '📖', insight: '💡', hot_take: '🔥', data: '📊', behind_scenes: '🎬', question: '❓', bridging: '🌉',
}
const INDUSTRY_ICON: Record<string, string> = { Aerospace: '✈️', IT: '💻', Trucking: '🚛', Drone: '🛸', Business: '📊' }

function MetricBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: I1d }}>{label}</span>
        <span className="text-[11px] font-bold" style={{ color: I1 }}>{value.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(12,44,82,0.08)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function PostPerformance() {
  const [posts, setPosts]   = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all')

  useEffect(() => {
    fetch('/api/content-lab/posts')
      .then(r => r.json())
      .then(d => { setPosts(d.posts ?? []); setLoading(false) })
  }, [])

  const published = posts.filter(p => p.status === 'published')

  const totalImpressions = published.reduce((s, p) => s + (p.impressions ?? 0), 0)
  const totalLikes       = published.reduce((s, p) => s + (p.likes ?? 0), 0)
  const totalComments    = published.reduce((s, p) => s + (p.comments ?? 0), 0)
  const totalShares      = published.reduce((s, p) => s + (p.shares ?? 0), 0)

  const engagementRate = totalImpressions > 0
    ? (((totalLikes + totalComments + totalShares) / totalImpressions) * 100).toFixed(1)
    : '—'

  // Best performing post (by impressions)
  const best = [...published].sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))[0]

  // Tone breakdown for published posts
  const toneBreakdown: Record<string, { count: number; impressions: number }> = {}
  for (const p of published) {
    if (!toneBreakdown[p.tone]) toneBreakdown[p.tone] = { count: 0, impressions: 0 }
    toneBreakdown[p.tone].count++
    toneBreakdown[p.tone].impressions += p.impressions ?? 0
  }
  const toneEntries = Object.entries(toneBreakdown).sort((a, b) => b[1].impressions - a[1].impressions)

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter)

  return (
    <div className="flex flex-col gap-5">
      {/* KPI row */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Posts Published', value: published.length,           color: I1     },
          { label: 'Total Impressions', value: totalImpressions,         color: ACCENT },
          { label: 'Likes',            value: totalLikes,                color: '#059669' },
          { label: 'Comments',         value: totalComments,             color: '#7c3aed' },
          { label: 'Eng. Rate',        value: `${engagementRate}%`,      color: '#d97706', raw: true },
        ].map(k => (
          <div key={k.label} style={{ ...G1, padding: '14px 18px' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: I1d }}>{k.label}</p>
            <p className="text-[22px] font-bold" style={{ color: k.color }}>
              {'raw' in k && k.raw ? k.value : (typeof k.value === 'number' ? k.value.toLocaleString() : k.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Tone performance */}
        <div style={{ ...G1, padding: '20px 24px' }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: I1d }}>Performance by Tone</p>
          {toneEntries.length === 0 ? (
            <p className="text-[12px]" style={{ color: I1d }}>No published posts yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {toneEntries.map(([tone, data]) => (
                <div key={tone}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] font-semibold" style={{ color: I1 }}>
                      {TONE_ICONS[tone] ?? '✍️'} {tone.replace('_', ' ')}
                    </span>
                    <span className="text-[11px]" style={{ color: I1c }}>{data.count} post{data.count > 1 ? 's' : ''} · {data.impressions.toLocaleString()} impr.</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(12,44,82,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${toneEntries[0][1].impressions > 0 ? (data.impressions / toneEntries[0][1].impressions) * 100 : 0}%`, background: ACCENT }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best post */}
        <div style={{ ...G1, padding: '20px 24px' }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: I1d }}>🏆 Top Post</p>
          {!best ? (
            <p className="text-[12px]" style={{ color: I1d }}>No published posts yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span>{INDUSTRY_ICON[best.industry_tag] ?? '📝'}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}>{best.industry_tag}</span>
                <span className="text-[10px]" style={{ color: I1d }}>
                  {best.published_at ? new Date(best.published_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) : ''}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: I1 }}>
                {best.content.length > 160 ? best.content.slice(0, 160) + '…' : best.content}
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <MetricBar label="Impressions" value={best.impressions ?? 0} max={best.impressions ?? 1} color={ACCENT} />
                <MetricBar label="Likes"       value={best.likes ?? 0}       max={best.impressions ?? 1} color="#059669" />
                <MetricBar label="Comments"    value={best.comments ?? 0}    max={best.impressions ?? 1} color="#7c3aed" />
                <MetricBar label="Shares"      value={best.shares ?? 0}      max={best.impressions ?? 1} color="#d97706" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Posts table */}
      <div style={{ ...G1, padding: '20px 24px' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: I1d }}>All Posts</p>
          <div className="flex gap-1.5">
            {(['all', 'published', 'scheduled', 'draft'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all capitalize"
                style={{ background: filter === f ? ACCENT : 'rgba(12,44,82,0.08)', color: filter === f ? '#fff' : I1c }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-[12px] py-8 text-center" style={{ color: I1d }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-[12px] py-8 text-center" style={{ color: I1d }}>No posts found</p>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(p => {
              const statusColor = p.status === 'published' ? '#059669' : p.status === 'scheduled' ? ACCENT : I1d
              return (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(12,44,82,0.03)', border: '1px solid rgba(12,44,82,0.08)' }}>
                  <span className="text-[16px] shrink-0">{INDUSTRY_ICON[p.industry_tag] ?? '📝'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] leading-snug" style={{ color: I1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {p.content.slice(0, 80)}…
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px]" style={{ color: I1d }}>{p.industry_tag}</span>
                      {p.venture_slug && <span className="text-[10px]" style={{ color: I1d }}>· {p.venture_slug}</span>}
                      <span className="text-[10px]" style={{ color: I1d }}>· {TONE_ICONS[p.tone] ?? '✍️'} {p.tone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-right">
                    {p.status === 'published' && (
                      <>
                        <div>
                          <p className="text-[11px] font-bold" style={{ color: I1 }}>{(p.impressions ?? 0).toLocaleString()}</p>
                          <p className="text-[9px] uppercase" style={{ color: I1d }}>Impr.</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold" style={{ color: I1 }}>{p.likes ?? 0}</p>
                          <p className="text-[9px] uppercase" style={{ color: I1d }}>Likes</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold" style={{ color: I1 }}>{p.comments ?? 0}</p>
                          <p className="text-[9px] uppercase" style={{ color: I1d }}>Cmts</p>
                        </div>
                      </>
                    )}
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: `${statusColor}1a`, color: statusColor }}>
                      {p.status}
                    </span>
                    {p.scheduled_date && p.status === 'scheduled' && (
                      <span className="text-[10px]" style={{ color: I1d }}>
                        {new Date(p.scheduled_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
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
