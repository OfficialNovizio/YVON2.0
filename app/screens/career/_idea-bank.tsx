'use client'

import { useEffect, useState } from 'react'
import CreativePanel from './_creative-panel'

interface Idea {
  id: string
  topic: string
  industry_tag: string
  venture_slug: string | null
  rough_idea: string | null
  created_at: string
}

interface TrendingTopic {
  topic: string
  industry: string
  why_hot: string
  suggested_tone: string
  hook: string
}

interface AgentAngle {
  angle: string
  industries: string[]
  why_unique: string
  tone_suggestion: string
  example_hook: string
}

interface PanelCtx {
  topic: string
  industry: string
  toneSuggestion?: string
}

type Layer = 'trending' | 'agent' | 'saved'

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70)' }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const INDUSTRIES = ['Aerospace', 'IT', 'Trucking', 'Drone', 'Business']
const VENTURES   = [{ value: '', label: 'Personal' }, { value: 'novizio', label: 'Novizio' }, { value: 'hourbour', label: 'Hourbour' }]
const INDUSTRY_ICON: Record<string, string> = { Aerospace: '✈️', IT: '💻', Trucking: '🚛', Drone: '🛸', Business: '📊' }
const TONE_ICONS: Record<string, string>   = { story: '📖', insight: '💡', hot_take: '🔥', data: '📊', behind_scenes: '🎬', question: '❓', bridging: '🌉' }

const inputStyle: React.CSSProperties = {
  background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.15)',
  borderRadius: 12, padding: '10px 14px', color: I1, fontSize: 13, width: '100%',
}

const LAYER_TABS: { id: Layer; label: string; icon: string }[] = [
  { id: 'trending', label: 'Trending Now',    icon: '🔥' },
  { id: 'agent',    label: 'Agent Picks',     icon: '🤖' },
  { id: 'saved',    label: 'Saved Ideas',     icon: '💡' },
]

interface Props {
  onDraftIdea: (topic: string) => void
  onGoToCalendar: () => void
}

export default function IdeaBank({ onDraftIdea, onGoToCalendar }: Props) {
  const [layer, setLayer]   = useState<Layer>('trending')
  const [panel, setPanel]   = useState<PanelCtx | null>(null)

  // Trending
  const [trending, setTrending]           = useState<TrendingTopic[]>([])
  const [trendingLoad, setTrendingLoad]   = useState(false)
  const [trendingDone, setTrendingDone]   = useState(false)

  // Agent picks
  const [angles, setAngles]               = useState<AgentAngle[]>([])
  const [anglesLoad, setAnglesLoad]       = useState(false)
  const [anglesDone, setAnglesDone]       = useState(false)

  // Saved ideas
  const [ideas, setIdeas]                 = useState<Idea[]>([])
  const [savedLoad, setSavedLoad]         = useState(true)
  const [filterInd, setFilterInd]         = useState('All')
  const [saving, setSaving]               = useState(false)
  const [showForm, setShowForm]           = useState(false)
  const [formTopic, setFormTopic]         = useState('')
  const [formInd, setFormInd]             = useState('Aerospace')
  const [formVenture, setFormVenture]     = useState('')
  const [formNote, setFormNote]           = useState('')
  const [savedToast, setSavedToast]       = useState('')

  function showSavedToast(msg: string) {
    setSavedToast(msg)
    setTimeout(() => setSavedToast(''), 2500)
  }

  // Load saved ideas
  useEffect(() => {
    fetch('/api/content-lab/ideas')
      .then(r => r.json())
      .then(d => { setIdeas(d.ideas ?? []); setSavedLoad(false) })
  }, [])

  // Auto-fetch when layer is first selected
  useEffect(() => {
    if (layer === 'trending' && !trendingDone && !trendingLoad) fetchTrending()
    if (layer === 'agent'    && !anglesDone   && !anglesLoad)   fetchAngles()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer])

  async function fetchTrending() {
    setTrendingLoad(true)
    const res  = await fetch('/api/content-lab/trending', { method: 'POST' })
    const data = await res.json()
    setTrending(data.topics ?? [])
    setTrendingLoad(false)
    setTrendingDone(true)
  }

  async function fetchAngles() {
    setAnglesLoad(true)
    const res  = await fetch('/api/content-lab/angles', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}),
    })
    const data = await res.json()
    setAngles(data.angles ?? [])
    setAnglesLoad(false)
    setAnglesDone(true)
  }

  async function quickSaveIdea(topic: string, industry: string, tone?: string) {
    const res  = await fetch('/api/content-lab/ideas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, industry_tag: industry, rough_idea: tone ? `Suggested tone: ${tone}` : null }),
    })
    const data = await res.json()
    if (data.idea) { setIdeas(prev => [data.idea, ...prev]); showSavedToast('Saved to Idea Bank ✓') }
  }

  async function addManualIdea() {
    if (!formTopic.trim()) return
    setSaving(true)
    const res  = await fetch('/api/content-lab/ideas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: formTopic, industry_tag: formInd, venture_slug: formVenture || null, rough_idea: formNote || null }),
    })
    const data = await res.json()
    if (data.idea) {
      setIdeas(prev => [data.idea, ...prev])
      setFormTopic(''); setFormNote(''); setFormVenture(''); setShowForm(false)
    }
    setSaving(false)
  }

  async function deleteIdea(id: string) {
    await fetch(`/api/content-lab/ideas?id=${id}`, { method: 'DELETE' })
    setIdeas(prev => prev.filter(i => i.id !== id))
  }

  function openPanel(topic: string, industry: string, tone?: string) {
    setPanel({ topic, industry, toneSuggestion: tone })
  }

  const filteredIdeas = filterInd === 'All' ? ideas : ideas.filter(i => i.industry_tag === filterInd)

  return (
    <>
      {panel && (
        <CreativePanel
          topic={panel.topic}
          industry={panel.industry}
          toneSuggestion={panel.toneSuggestion}
          onClose={() => setPanel(null)}
          onGoToCalendar={onGoToCalendar}
        />
      )}

      {/* Saved toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-[13px] font-bold text-white" style={{ background: '#0066cc', boxShadow: '0 8px 24px rgba(0,102,204,0.4)' }}>
          {savedToast}
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Layer tabs */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(8,16,36,0.58)', border: '1px solid rgba(255,255,255,0.12)' }}>
            {LAYER_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setLayer(t.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
                style={{
                  background: layer === t.id ? 'rgba(255,255,255,0.92)' : 'transparent',
                  color:      layer === t.id ? '#0c0d10' : 'rgba(220,228,248,0.55)',
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TRENDING NOW ── */}
        {layer === 'trending' && (
          <div style={{ ...G1, padding: '20px 24px' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[13px] font-bold" style={{ color: I1 }}>Sizzling Topics Right Now</p>
                <p className="text-[11px] mt-0.5" style={{ color: I1d }}>Industry trends you can authentically post about</p>
              </div>
              <button
                onClick={fetchTrending}
                disabled={trendingLoad}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all"
                style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                {trendingLoad ? 'Fetching…' : 'Refresh'}
              </button>
            </div>

            {trendingLoad && (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'rgba(12,44,82,0.06)' }} />
                ))}
              </div>
            )}

            {!trendingLoad && trending.length === 0 && trendingDone && (
              <p className="text-[12px] py-8 text-center" style={{ color: I1d }}>No topics loaded — try refreshing</p>
            )}

            {!trendingLoad && trending.length > 0 && (
              <div className="flex flex-col gap-3">
                {trending.map((t, i) => (
                  <div key={i} className="p-4 rounded-2xl flex items-start justify-between gap-4" style={{ background: 'rgba(12,44,82,0.03)', border: '1px solid rgba(12,44,82,0.08)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{INDUSTRY_ICON[t.industry] ?? '📝'}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}>{t.industry}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(220,38,38,0.10)', color: '#dc2626' }}>
                          {TONE_ICONS[t.suggested_tone] ?? '✍️'} {t.suggested_tone.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[14px] font-semibold leading-snug mb-1.5" style={{ color: I1 }}>{t.topic}</p>
                      <p className="text-[11px] leading-relaxed mb-2" style={{ color: I1c }}>{t.why_hot}</p>
                      <p className="text-[11px] italic" style={{ color: I1d }}>Hook: &ldquo;{t.hook}&rdquo;</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => openPanel(t.topic, t.industry, t.suggested_tone)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap"
                        style={{ background: ACCENT, color: '#fff' }}
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                        Create Post
                      </button>
                      <button
                        onClick={() => quickSaveIdea(t.topic, t.industry, t.suggested_tone)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap"
                        style={{ background: 'rgba(12,44,82,0.08)', color: I1c }}
                      >
                        <span className="material-symbols-outlined text-[14px]">bookmark</span>
                        Save Idea
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AGENT PICKS ── */}
        {layer === 'agent' && (
          <div style={{ ...G1, padding: '20px 24px' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[13px] font-bold" style={{ color: I1 }}>Agent Picks — Your Unique Angles</p>
                <p className="text-[11px] mt-0.5" style={{ color: I1d }}>Posts only you can write — impossible to fake without your exact background</p>
              </div>
              <button
                onClick={fetchAngles}
                disabled={anglesLoad}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all"
                style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                {anglesLoad ? 'Thinking…' : 'Regenerate'}
              </button>
            </div>

            {anglesLoad && (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(12,44,82,0.06)' }} />
                ))}
              </div>
            )}

            {!anglesLoad && angles.length === 0 && anglesDone && (
              <p className="text-[12px] py-8 text-center" style={{ color: I1d }}>No angles — try regenerating</p>
            )}

            {!anglesLoad && angles.length > 0 && (
              <div className="flex flex-col gap-3">
                {angles.map((a, i) => (
                  <div key={i} className="p-4 rounded-2xl flex items-start justify-between gap-4" style={{ background: 'rgba(0,102,204,0.04)', border: '1px solid rgba(0,102,204,0.10)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {a.industries.map(ind => (
                          <span key={ind} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}>
                            {INDUSTRY_ICON[ind] ?? ''} {ind}
                          </span>
                        ))}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}>
                          {TONE_ICONS[a.tone_suggestion] ?? '✍️'} {a.tone_suggestion.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[14px] font-semibold leading-snug mb-1.5" style={{ color: I1 }}>{a.angle}</p>
                      <p className="text-[11px] leading-relaxed mb-2" style={{ color: I1c }}>{a.why_unique}</p>
                      <p className="text-[11px] italic" style={{ color: I1d }}>Hook: &ldquo;{a.example_hook}&rdquo;</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => openPanel(a.angle, a.industries[0] ?? 'Business', a.tone_suggestion)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap"
                        style={{ background: ACCENT, color: '#fff' }}
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                        Create Post
                      </button>
                      <button
                        onClick={() => quickSaveIdea(a.angle, a.industries[0] ?? 'Business', a.tone_suggestion)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap"
                        style={{ background: 'rgba(12,44,82,0.08)', color: I1c }}
                      >
                        <span className="material-symbols-outlined text-[14px]">bookmark</span>
                        Save Idea
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SAVED IDEAS ── */}
        {layer === 'saved' && (
          <div style={{ ...G1, padding: '20px 24px' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-bold" style={{ color: I1 }}>Your Idea Bank</p>
              <button
                onClick={() => setShowForm(v => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
                style={{ background: ACCENT, color: '#fff' }}
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                New Idea
              </button>
            </div>

            {/* Add form */}
            {showForm && (
              <div className="mb-5 p-4 rounded-2xl flex flex-col gap-3" style={{ background: 'rgba(0,102,204,0.06)', border: '1px solid rgba(0,102,204,0.15)' }}>
                <input
                  style={{ ...inputStyle, fontSize: 14 }}
                  placeholder="Post topic or angle"
                  value={formTopic}
                  onChange={e => setFormTopic(e.target.value)}
                />
                <div className="flex gap-3">
                  <select style={{ ...inputStyle, flex: 1 }} value={formInd} onChange={e => setFormInd(e.target.value)}>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                  <select style={{ ...inputStyle, flex: 1 }} value={formVenture} onChange={e => setFormVenture(e.target.value)}>
                    {VENTURES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                  </select>
                </div>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  rows={2}
                  placeholder="Notes (optional)"
                  value={formNote}
                  onChange={e => setFormNote(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-[12px] font-bold" style={{ background: 'rgba(12,44,82,0.08)', color: I1 }}>Cancel</button>
                  <button
                    onClick={addManualIdea}
                    disabled={!formTopic.trim() || saving}
                    className="px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
                    style={{ background: ACCENT, color: '#fff', opacity: !formTopic.trim() || saving ? 0.6 : 1 }}
                  >
                    {saving ? 'Saving…' : 'Save Idea'}
                  </button>
                </div>
              </div>
            )}

            {/* Industry filter */}
            <div className="flex gap-2 flex-wrap mb-4">
              {['All', ...INDUSTRIES].map(ind => (
                <button
                  key={ind}
                  onClick={() => setFilterInd(ind)}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                  style={{ background: filterInd === ind ? ACCENT : 'rgba(12,44,82,0.08)', color: filterInd === ind ? '#fff' : I1c }}
                >
                  {ind !== 'All' && INDUSTRY_ICON[ind]} {ind}
                </button>
              ))}
            </div>

            {savedLoad ? (
              <p className="text-[12px] py-8 text-center" style={{ color: I1d }}>Loading…</p>
            ) : filteredIdeas.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <span className="material-symbols-outlined text-[40px]" style={{ color: 'rgba(0,102,204,0.25)' }}>lightbulb</span>
                <p className="text-[13px] font-semibold" style={{ color: I1d }}>No ideas saved yet</p>
                <p className="text-[11px]" style={{ color: I1d }}>Browse Trending Now or Agent Picks to save topics</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredIdeas.map(idea => (
                  <div key={idea.id} style={{ background: 'rgba(12,44,82,0.03)', border: '1px solid rgba(12,44,82,0.08)', borderRadius: 16 }} className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span>{INDUSTRY_ICON[idea.industry_tag] ?? '📝'}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}>{idea.industry_tag}</span>
                        {idea.venture_slug && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(5,150,105,0.10)', color: '#059669' }}>{idea.venture_slug}</span>}
                        <span className="text-[10px]" style={{ color: I1d }}>{new Date(idea.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <p className="text-[14px] font-semibold leading-snug" style={{ color: I1 }}>{idea.topic}</p>
                      {idea.rough_idea && <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: I1c }}>{idea.rough_idea}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openPanel(idea.topic, idea.industry_tag)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold"
                        style={{ background: ACCENT, color: '#fff' }}
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                        Create
                      </button>
                      <button
                        onClick={() => { onDraftIdea(idea.topic) }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold"
                        style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}
                      >
                        <span className="material-symbols-outlined text-[14px]">edit_note</span>
                        Draft
                      </button>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
