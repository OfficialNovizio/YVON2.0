'use client'

import { useEffect, useRef, useState } from 'react'
import CreativePanel from './_creative-panel'

interface RadarItem {
  headline: string
  industry: string
  summary: string
  why_relevant: string
  impact: 'opportunity' | 'threat' | 'watch' | 'neutral'
  source_type: 'regulatory' | 'market' | 'tech' | 'funding' | 'talent'
  suggested_angle: string
  post_hook: string
}

interface PanelCtx { topic: string; industry: string; toneSuggestion?: string }

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70)' }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const IMPACT_STYLE: Record<string, { bg: string; color: string; label: string; dot: string }> = {
  opportunity: { bg: 'rgba(5,150,105,0.12)',  color: '#059669', label: 'Opportunity', dot: '#059669' },
  threat:      { bg: 'rgba(220,38,38,0.10)',  color: '#dc2626', label: 'Threat',       dot: '#dc2626' },
  watch:       { bg: 'rgba(217,119,6,0.12)',  color: '#d97706', label: 'Watch',        dot: '#d97706' },
  neutral:     { bg: 'rgba(12,44,82,0.08)',   color: I1d,       label: 'Neutral',      dot: I1d       },
}

const SOURCE_ICON: Record<string, string> = {
  regulatory: '⚖️', market: '📈', tech: '🔬', funding: '💰', talent: '👥',
}

const IND_ICON: Record<string, string> = {
  Aerospace: '✈️', IT: '💻', Trucking: '🚛', Drone: '🛸', Business: '📊', Entrepreneurship: '🚀',
}
const IND_COLOR: Record<string, string> = {
  Aerospace: '#0066cc', IT: '#7c3aed', Trucking: '#d97706', Drone: '#059669', Business: '#0c2c52', Entrepreneurship: '#db2777',
}

const TONE_ICONS: Record<string, string> = {
  story: '📖', insight: '💡', hot_take: '🔥', data: '📊', behind_scenes: '🎬', question: '❓', bridging: '🌉',
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (diff < 1)  return 'just now'
  if (diff < 60) return `${diff}m ago`
  return `${Math.floor(diff / 60)}h ago`
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.40)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-20 rounded-full" style={{ background: 'rgba(12,44,82,0.10)' }} />
        <div className="h-5 w-16 rounded-full" style={{ background: 'rgba(12,44,82,0.08)' }} />
      </div>
      <div className="h-5 w-3/4 rounded mb-2" style={{ background: 'rgba(12,44,82,0.10)' }} />
      <div className="h-3 w-full rounded mb-1" style={{ background: 'rgba(12,44,82,0.07)' }} />
      <div className="h-3 w-5/6 rounded mb-1" style={{ background: 'rgba(12,44,82,0.07)' }} />
      <div className="h-3 w-2/3 rounded"      style={{ background: 'rgba(12,44,82,0.07)' }} />
    </div>
  )
}

interface Props {
  industry: string
  onGoToCalendar: () => void
}

export default function IndustryRadar({ industry, onGoToCalendar }: Props) {
  const [cache, setCache]       = useState<Record<string, RadarItem[]>>({})
  const [times, setTimes]       = useState<Record<string, string>>({})
  const [loading, setLoading]   = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [panel, setPanel]       = useState<PanelCtx | null>(null)
  const [savedToast, setSavedToast] = useState('')
  const fetchedRef              = useRef<Set<string>>(new Set())

  const items       = cache[industry] ?? []
  const refreshedAt = times[industry]

  function showSavedToast(msg: string) {
    setSavedToast(msg)
    setTimeout(() => setSavedToast(''), 2500)
  }

  async function fetch_(ind: string, force = false) {
    if (!force && fetchedRef.current.has(ind)) return
    setLoading(true)
    setFetchError('')
    fetchedRef.current.add(ind)
    try {
      const res  = await fetch('/api/industry-radar/feed', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: ind }),
      })
      const data = await res.json()
      if (data.items) {
        setCache(prev => ({ ...prev, [ind]: data.items }))
        setTimes(prev => ({ ...prev, [ind]: data.refreshed_at }))
      } else {
        setFetchError(data.error ?? 'API returned no items — check server logs')
        fetchedRef.current.delete(ind)
      }
    } catch {
      setFetchError('Network error — could not reach the feed API')
      fetchedRef.current.delete(ind)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch_(industry) }, [industry])

  async function saveToIdeas(item: RadarItem) {
    await fetch('/api/content-lab/ideas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: item.headline, industry_tag: item.industry, rough_idea: item.why_relevant }),
    })
    showSavedToast('Saved to Idea Bank ✓')
  }

  const impactOrder = ['threat', 'opportunity', 'watch', 'neutral']
  const sorted = [...items].sort((a, b) => impactOrder.indexOf(a.impact) - impactOrder.indexOf(b.impact))

  // Impact summary counts
  const counts = items.reduce((acc, it) => {
    acc[it.impact] = (acc[it.impact] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="flex flex-col gap-5">
      {panel && (
        <CreativePanel
          topic={panel.topic}
          industry={panel.industry}
          toneSuggestion={panel.toneSuggestion}
          onClose={() => setPanel(null)}
          onGoToCalendar={onGoToCalendar}
        />
      )}

      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-[13px] font-bold text-white" style={{ background: ACCENT, boxShadow: '0 8px 24px rgba(0,102,204,0.4)' }}>
          {savedToast}
        </div>
      )}

      {/* Header */}
      <div style={{ ...G1, padding: '18px 24px' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[13px] font-bold" style={{ color: I1 }}>Industry Radar</p>
            <p className="text-[11px] mt-0.5" style={{ color: I1d }}>
              {refreshedAt ? `Refreshed ${timeAgo(refreshedAt)}` : 'Intelligence briefing for your industries'}
            </p>
          </div>
          <button
            onClick={() => { fetchedRef.current.delete(industry); fetch_(industry, true) }}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all"
            style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}
          >
            <span className="material-symbols-outlined text-[14px]" style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>refresh</span>
            {loading ? 'Scanning…' : 'Refresh'}
          </button>
        </div>

        {/* Impact summary row */}
        {items.length > 0 && (
          <div className="flex gap-3">
            {(['threat', 'opportunity', 'watch', 'neutral'] as const).map(impact => {
              const s = IMPACT_STYLE[impact]
              const n = counts[impact] ?? 0
              if (!n) return null
              return (
                <div key={impact} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: s.bg }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                  <span className="text-[11px] font-bold" style={{ color: s.color }}>{n} {s.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Feed */}
      {loading && items.length === 0 ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div style={{ ...G1, padding: '56px 24px' }} className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[48px]" style={{ color: fetchError ? 'rgba(220,38,38,0.35)' : 'rgba(0,102,204,0.25)' }}>
            {fetchError ? 'error' : 'radar'}
          </span>
          <p className="text-[13px] font-semibold" style={{ color: I1d }}>
            {fetchError ? 'Feed failed — click Refresh to retry' : 'No intelligence loaded — click Refresh'}
          </p>
          {fetchError && (
            <p className="text-[11px] max-w-sm text-center px-4 py-2 rounded-xl" style={{ color: '#dc2626', background: 'rgba(220,38,38,0.08)' }}>
              {fetchError}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((item, i) => {
            const imp = IMPACT_STYLE[item.impact] ?? IMPACT_STYLE.neutral
            const indColor = IND_COLOR[item.industry] ?? '#6b7280'
            return (
              <div key={i} style={{ ...G1, padding: '20px 24px', borderLeft: `4px solid ${imp.dot}` }}>

                {/* Top badges row */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {/* Impact */}
                  <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: imp.bg, color: imp.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: imp.dot }} />
                    {imp.label}
                  </span>

                  {/* Industry */}
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${indColor}1a`, color: indColor }}>
                    {IND_ICON[item.industry] ?? '📝'} {item.industry}
                  </span>

                  {/* Source type */}
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: 'rgba(12,44,82,0.07)', color: I1d }}>
                    {SOURCE_ICON[item.source_type] ?? '📌'} {item.source_type}
                  </span>
                </div>

                {/* Headline */}
                <p className="text-[15px] font-bold leading-snug mb-2" style={{ color: I1 }}>{item.headline}</p>

                {/* Summary */}
                <p className="text-[12px] leading-relaxed mb-3" style={{ color: I1c }}>{item.summary}</p>

                {/* Why relevant */}
                <div className="flex items-start gap-2 mb-3 p-3 rounded-xl" style={{ background: 'rgba(0,102,204,0.05)', border: '1px solid rgba(0,102,204,0.10)' }}>
                  <span className="material-symbols-outlined text-[15px] shrink-0 mt-0.5" style={{ color: ACCENT }}>person</span>
                  <p className="text-[11px] leading-relaxed" style={{ color: I1c }}>{item.why_relevant}</p>
                </div>

                {/* Post hook */}
                <div className="flex items-start gap-2 mb-4">
                  <span className="text-[14px] shrink-0">{TONE_ICONS[item.suggested_angle] ?? '✍️'}</span>
                  <p className="text-[11px] italic leading-relaxed" style={{ color: I1d }}>
                    &ldquo;{item.post_hook}&rdquo;
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPanel({ topic: item.headline, industry: item.industry, toneSuggestion: item.suggested_angle })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
                    style={{ background: ACCENT, color: '#fff' }}
                  >
                    <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                    Draft Post
                  </button>
                  <button
                    onClick={() => saveToIdeas(item)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
                    style={{ background: 'rgba(12,44,82,0.08)', color: I1c }}
                  >
                    <span className="material-symbols-outlined text-[15px]">bookmark</span>
                    Save to Ideas
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
