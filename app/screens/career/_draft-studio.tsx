'use client'

import { useEffect, useState } from 'react'

interface ToneRecommendation {
  tone:            string
  tone_label:      string
  why:             string
  reach_tip:       string
  draft:           string
}

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70)' }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const INDUSTRIES = ['Aerospace', 'IT', 'Trucking', 'Drone', 'Business']
const VENTURES   = [{ value: '', label: 'Personal' }, { value: 'novizio', label: 'Novizio' }, { value: 'hourbour', label: 'Hourbour' }]
const TONE_ICONS: Record<string, string> = {
  story: '📖', insight: '💡', hot_take: '🔥', data: '📊', behind_scenes: '🎬', question: '❓', bridging: '🌉',
}

const inputStyle = { background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.15)', borderRadius: 12, padding: '10px 14px', color: I1, fontSize: 13, width: '100%' }

interface DraftStudioProps {
  prefillDate?: string
  prefillTopic?: string
  linkedinConnected: boolean
}

export default function DraftStudio({ prefillDate, prefillTopic, linkedinConnected }: DraftStudioProps) {
  const [topic, setTopic]             = useState(prefillTopic ?? '')
  useEffect(() => { if (prefillTopic) setTopic(prefillTopic) }, [prefillTopic])

  const [industry, setIndustry]       = useState('Aerospace')
  const [venture, setVenture]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [recs, setRecs]               = useState<ToneRecommendation[]>([])
  const [selected, setSelected]       = useState<ToneRecommendation | null>(null)
  const [editedDraft, setEditedDraft] = useState('')
  const [schedDate, setSchedDate]     = useState(prefillDate ?? '')
  const [saving, setSaving]           = useState(false)
  const [publishing, setPublishing]   = useState(false)
  const [savedId, setSavedId]         = useState<string | null>(null)
  const [toast, setToast]             = useState('')

  // Cross-industry angles
  const [anglesLoading, setAnglesLoading] = useState(false)
  const [angles, setAngles]               = useState<{ angle: string; industries: string[]; why_unique: string; tone_suggestion: string; example_hook: string }[]>([])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function generateDrafts() {
    if (!topic.trim()) return
    setLoading(true)
    setRecs([])
    setSelected(null)
    try {
      const res  = await fetch('/api/content-lab/draft', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, industry_tag: industry, venture_slug: venture || null, generate_all: true }),
      })
      const data = await res.json()
      setRecs(data.recommendations ?? [])
    } finally { setLoading(false) }
  }

  async function generateAngles() {
    setAnglesLoading(true)
    setAngles([])
    const res  = await fetch('/api/content-lab/angles', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const data = await res.json()
    setAngles(data.angles ?? [])
    setAnglesLoading(false)
  }

  function selectTone(rec: ToneRecommendation) {
    setSelected(rec)
    setEditedDraft(rec.draft)
  }

  function applyAngle(angle: { angle: string; example_hook: string }) {
    setTopic(angle.angle)
    setAngles([])
  }

  async function savePost(status: 'draft' | 'scheduled') {
    if (!editedDraft.trim() || !selected) return
    setSaving(true)
    const res  = await fetch('/api/content-lab/posts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: editedDraft, industry_tag: industry,
        venture_slug: venture || null, tone: selected.tone,
        status, scheduled_date: schedDate || null,
      }),
    })
    const data = await res.json()
    if (data.post) {
      setSavedId(data.post.id)
      showToast(status === 'scheduled' ? 'Scheduled ✓' : 'Saved to drafts ✓')
    }
    setSaving(false)
  }

  async function publishNow() {
    if (!savedId) { await savePost('draft'); return }
    if (!linkedinConnected) { showToast('Connect LinkedIn first'); return }
    setPublishing(true)
    const res  = await fetch('/api/linkedin/publish', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: savedId }),
    })
    const data = await res.json()
    if (data.ok) showToast('Published to LinkedIn ✓')
    else showToast(data.error ?? 'Publish failed')
    setPublishing(false)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-[13px] font-bold text-white" style={{ background: '#059669', boxShadow: '0 8px 24px rgba(5,150,105,0.4)' }}>
          {toast}
        </div>
      )}

      {/* Topic input */}
      <div style={{ ...G1, padding: '20px 24px' }}>
        <p className="text-[13px] font-bold mb-4" style={{ color: I1 }}>Draft Studio</p>
        <div className="flex flex-col gap-3">
          <input
            style={{ ...inputStyle, fontSize: 14 }}
            placeholder="What do you want to post about? (e.g. 'What aircraft maintenance taught me about software bugs')"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generateDrafts()}
          />
          <div className="flex gap-3">
            <select style={{ ...inputStyle, flex: 1 }} value={industry} onChange={e => setIndustry(e.target.value)}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
            <select style={{ ...inputStyle, flex: 1 }} value={venture} onChange={e => setVenture(e.target.value)}>
              {VENTURES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
            <button
              onClick={generateDrafts}
              disabled={!topic.trim() || loading}
              className="px-6 py-2 rounded-xl text-[13px] font-bold transition-all"
              style={{ background: '#0066cc', color: '#fff', opacity: !topic.trim() || loading ? 0.6 : 1, whiteSpace: 'nowrap' }}
            >
              {loading ? 'Generating…' : 'Get Tone Suggestions'}
            </button>
          </div>
        </div>

        {/* Cross-industry angle generator */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(12,44,82,0.10)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: I1d }}>🌉 Cross-Industry Angles</p>
            <button
              onClick={generateAngles}
              disabled={anglesLoading}
              className="text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
              style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}
            >
              {anglesLoading ? 'Generating…' : 'Generate angles'}
            </button>
          </div>
          {angles.length > 0 && (
            <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              {angles.map((a, i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,102,204,0.05)', border: '1px solid rgba(0,102,204,0.12)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold leading-snug" style={{ color: I1 }}>{a.angle}</p>
                    <p className="text-[10px] mt-1" style={{ color: I1d }}>{a.industries.join(' + ')} · {a.why_unique}</p>
                    <p className="text-[11px] italic mt-1" style={{ color: I1c }}>&quot;{a.example_hook}&quot;</p>
                  </div>
                  <button
                    onClick={() => applyAngle(a)}
                    className="shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg"
                    style={{ background: ACCENT, color: '#fff' }}
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tone recommendations */}
      {recs.length > 0 && (
        <div style={{ ...G1, padding: '20px 24px' }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: I1d }}>Claude&apos;s tone recommendations for this topic</p>
          <div className="grid grid-cols-3 gap-3">
            {recs.map(rec => (
              <button
                key={rec.tone}
                onClick={() => selectTone(rec)}
                className="text-left p-4 rounded-2xl transition-all"
                style={{
                  background: selected?.tone === rec.tone ? 'rgba(0,102,204,0.12)' : 'rgba(12,44,82,0.04)',
                  border: selected?.tone === rec.tone ? `2px solid ${ACCENT}` : '2px solid transparent',
                }}
              >
                <p className="text-[18px] mb-1">{TONE_ICONS[rec.tone] ?? '✍️'}</p>
                <p className="text-[13px] font-bold mb-1" style={{ color: I1 }}>{rec.tone_label}</p>
                <p className="text-[11px] leading-relaxed mb-2" style={{ color: I1c }}>{rec.why}</p>
                <p className="text-[10px] font-semibold" style={{ color: '#059669' }}>📈 {rec.reach_tip}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Draft editor */}
      {selected && (
        <div style={{ ...G1, padding: '20px 24px' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: I1d }}>
              {TONE_ICONS[selected.tone]} {selected.tone_label} draft — edit freely
            </p>
            <span className="text-[11px]" style={{ color: I1d }}>{editedDraft.length} chars</span>
          </div>
          <textarea
            value={editedDraft}
            onChange={e => setEditedDraft(e.target.value)}
            rows={12}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontFamily: 'inherit' }}
          />

          {/* Schedule + actions */}
          <div className="flex items-center gap-3 mt-4">
            <input
              type="date" value={schedDate}
              onChange={e => setSchedDate(e.target.value)}
              style={{ ...inputStyle, width: 'auto' }}
            />
            <button
              onClick={() => savePost('draft')}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all"
              style={{ background: 'rgba(12,44,82,0.08)', color: I1 }}
            >
              Save Draft
            </button>
            <button
              onClick={() => savePost('scheduled')}
              disabled={saving || !schedDate}
              className="px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all"
              style={{ background: 'rgba(0,102,204,0.12)', color: ACCENT, opacity: !schedDate ? 0.5 : 1 }}
            >
              Schedule
            </button>
            <button
              onClick={publishNow}
              disabled={publishing || !linkedinConnected}
              className="px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-2"
              style={{ background: linkedinConnected ? '#0066cc' : 'rgba(12,44,82,0.10)', color: linkedinConnected ? '#fff' : I1d }}
              title={!linkedinConnected ? 'Connect LinkedIn first' : ''}
            >
              {publishing ? 'Publishing…' : '⬆ Publish to LinkedIn'}
            </button>
          </div>
          {!linkedinConnected && (
            <p className="text-[11px] mt-2" style={{ color: '#d97706' }}>
              ⚠ LinkedIn not connected — <a href="/api/linkedin/connect" className="underline font-semibold">Connect now</a>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
