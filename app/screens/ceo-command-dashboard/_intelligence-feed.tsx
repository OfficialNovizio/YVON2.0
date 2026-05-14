'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ──────────────────────────────────────────────────────────────────────

interface PitchData {
  id: string
  rank: number
  platform: string
  format: string
  category: 'competitor_gap' | 'unclaimed_territory' | 'blue_ocean'
  hookA: string
  hookB: string
  leverPrimary: string
  psychologyScore: number | null
  system1ScoreA: number | null
  system1ScoreB: number | null
  runRecommendation: string | null
  marketEffect: string | null
  vsCurrent: string | null
  viralMechanism: string | null
  status: string
}

interface BatchData {
  id: string
  number: number
  status: string
  createdAt: string
}

interface SourceReport {
  id: string
  title: string
  summary: string
  createdAt: string
  reportNumber: number
}

interface IntelligenceData {
  hasData: boolean
  isDemo?: boolean
  batch?: BatchData
  pitches?: PitchData[]
  sourceReports?: {
    analytics: SourceReport | null
    marketing: SourceReport | null
    competitor: SourceReport | null
  }
  message?: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function catLabel(category: string): { label: string; color: string } {
  switch (category) {
    case 'blue_ocean':
      return { label: 'Blue Ocean', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' }
    case 'competitor_gap':
      return { label: 'Comp. Gap', color: 'text-[#0066cc] bg-[#0066cc]/10 border-[#0066cc]/20' }
    case 'unclaimed_territory':
      return { label: 'Territory', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' }
    default:
      return { label: category, color: 'text-white/40 bg-white/5 border-white/10' }
  }
}

function leverLayer(lever: string): number {
  const m = lever.match(/L(\d)/)
  return m ? parseInt(m[1]) : 6
}

function leverColor(lever: string): string {
  const layer = leverLayer(lever)
  const colors = ['', '#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6', '#eab308', '#6366f1']
  return colors[layer] ?? '#64748b'
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// ─── Pitch Card ─────────────────────────────────────────────────────────────────

function PitchCard({ pitch, onApprove, onDraft }: {
  pitch: PitchData
  onApprove: (id: string) => void
  onDraft: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const cat = catLabel(pitch.category)
  const score = pitch.psychologyScore ?? 0
  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'
  const runText = pitch.runRecommendation === 'A' ? 'Run A first' : 'Run B first'

  return (
    <div
      className={`rounded-[14px] border transition-all duration-200 cursor-pointer ${
        expanded ? 'border-white/20 bg-white/[0.06]' : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.05]'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header row */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${cat.color}`}>
            {cat.label}
          </span>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex-shrink-0">
            {pitch.platform} · {pitch.format}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[16px] font-bold ${scoreColor}`}>{score}</span>
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
              style={{ width: `${Math.min(score, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hook preview (always visible) */}
      <div className="px-4 pb-3">
        <p className="text-[13px] text-white/80 font-medium leading-snug line-clamp-1">
          {pitch.hookA}
        </p>
      </div>

      {/* Lever strip (always visible) */}
      <div className="px-4 pb-4 flex items-center gap-3 text-[10px] text-white/30">
        <span className={`inline-block w-1.5 h-1.5 rounded-full`} style={{ background: leverColor(pitch.leverPrimary) }} />
        <span className="font-medium">{pitch.leverPrimary}</span>
        <span className="ml-auto font-medium">{runText}</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
          {/* Two hooks side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-[10px] border ${pitch.runRecommendation === 'A' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-white/[0.02]'}`}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Hook A</span>
                <span className={`text-[10px] font-bold ${pitch.system1ScoreA && pitch.system1ScoreA >= 4 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  S1: {pitch.system1ScoreA ?? '—'}/5
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">{pitch.hookA}</p>
              {pitch.runRecommendation === 'A' && (
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-1 block">✓ Recommended</span>
              )}
            </div>
            <div className={`p-3 rounded-[10px] border ${pitch.runRecommendation === 'B' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-white/[0.02]'}`}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Hook B</span>
                <span className={`text-[10px] font-bold ${pitch.system1ScoreB && pitch.system1ScoreB >= 4 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  S1: {pitch.system1ScoreB ?? '—'}/5
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">{pitch.hookB}</p>
              {pitch.runRecommendation === 'B' && (
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-1 block">✓ Recommended</span>
              )}
            </div>
          </div>

          {/* Market effect + vs current */}
          {pitch.marketEffect && (
            <div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Market Effect</span>
              <p className="text-[11px] text-white/60 mt-0.5">{pitch.marketEffect}</p>
            </div>
          )}
          {pitch.vsCurrent && (
            <div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Vs. Current</span>
              <p className="text-[11px] text-white/60 mt-0.5">{pitch.vsCurrent}</p>
            </div>
          )}
          {pitch.viralMechanism && (
            <div className="bg-amber-400/5 border border-amber-400/10 p-2 rounded-[8px]">
              <span className="text-[8px] font-bold uppercase tracking-widest text-amber-400/60">Viral Mechanism</span>
              <p className="text-[10px] text-amber-400/80 mt-0.5">{pitch.viralMechanism}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={(e) => { e.stopPropagation(); onDraft(pitch.id) }}
              className="flex-1 py-2 rounded-full bg-[#0066cc]/20 text-[#0066cc] text-[10px] font-bold uppercase tracking-widest border border-[#0066cc]/20 hover:bg-[#0066cc]/30 transition-all active:scale-95"
            >
              Draft in Creative Studio
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onApprove(pitch.id) }}
              className="flex-1 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/30 transition-all active:scale-95"
            >
              Approve & Queue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Intelligence Feed ──────────────────────────────────────────────────────────

export default function IntelligenceFeed({ onWarRoom }: { onWarRoom: () => void }) {
  const router = useRouter()
  const [data, setData] = useState<IntelligenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIntelligence = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/intelligence/latest')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json() as IntelligenceData
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchIntelligence() }, [fetchIntelligence])

  const handleApprove = async (pitchId: string) => {
    try {
      await fetch(`/api/intelligence/approve`, { method: 'POST', body: JSON.stringify({ pitchId }) })
      fetchIntelligence()
    } catch { /* server handles */ }
  }

  const handleDraft = (pitchId: string) => {
    router.push(`/screens/creative-studio?pitch=${pitchId}`)
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-5">
          <h5 className="text-[11px] font-medium uppercase tracking-widest text-white/40">Intelligence</h5>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/10 border-t-[#0066cc] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-5">
          <h5 className="text-[11px] font-medium uppercase tracking-widest text-white/40">Intelligence</h5>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[11px] text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!data?.hasData || !data?.pitches || data.pitches.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-5">
          <h5 className="text-[11px] font-medium uppercase tracking-widest text-white/40">Intelligence</h5>
        </div>
        <div className="flex-1 flex items-center justify-center flex-col gap-3">
          <span className="material-symbols-outlined text-[24px] text-white/10">radar</span>
          <p className="text-[11px] text-white/30 text-center px-4 leading-relaxed">
            {data?.message ?? 'No intelligence generated yet.'}
          </p>
          <button
            onClick={() => router.push('/screens/war-room')}
            className="mt-2 text-[10px] font-bold text-[#0066cc] uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            Generate in War Room
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h5 className="text-[11px] font-medium uppercase tracking-widest text-white/40">Intelligence</h5>
          {data.batch && (
            <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-white/5">
              Batch #{data.batch.number}
            </span>
          )}
          {data.isDemo && (
            <span className="text-[8px] text-amber-400 font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
              DEMO
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-white/20 font-medium">
            {data.batch ? timeAgo(data.batch.createdAt) : ''}
          </span>
          <button
            onClick={fetchIntelligence}
            className="w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 transition-colors text-white/40"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Proposals count */}
      <div className="mb-4">
        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
          {data.pitches.length} proposals · Built from 3 department reports
        </span>
      </div>

      {/* Pitch cards — scrollable */}
      <div className="flex-1 space-y-2.5 overflow-y-auto min-h-0 pr-1">
        {data.pitches
          .sort((a, b) => a.rank - b.rank)
          .map((pitch) => (
            <div key={pitch.id} className="flex items-start gap-2">
              <span className="text-[9px] font-bold text-white/20 mt-[14px] min-w-[14px] text-right">
                #{pitch.rank}
              </span>
              <div className="flex-1">
                <PitchCard pitch={pitch} onApprove={handleApprove} onDraft={handleDraft} />
              </div>
            </div>
          ))}
      </div>

      {/* Footer actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
        <button
          onClick={onWarRoom}
          className="flex-1 py-2 rounded-full bg-gradient-to-r from-violet-900/50 to-indigo-900/50 border border-violet-500/20 text-[10px] font-bold uppercase tracking-widest text-violet-300/80 hover:from-violet-900/70 hover:to-indigo-900/70 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[13px]">bolt</span>
          Full Brief in War Room
        </button>
        <button
          onClick={() => router.push('/screens/analytics')}
          className="flex-1 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:bg-white/10 transition-all active:scale-[0.98]"
        >
          View History
        </button>
      </div>
    </div>
  )
}
