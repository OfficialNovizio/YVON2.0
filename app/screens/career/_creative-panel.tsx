'use client'

import { useState } from 'react'

interface CreativePanelProps {
  topic: string
  industry: string
  toneSuggestion?: string
  onClose: () => void
  onGoToCalendar: () => void
}

const TONES = [
  { id: 'story',         label: 'Story',        icon: '📖' },
  { id: 'insight',       label: 'Insight',       icon: '💡' },
  { id: 'hot_take',      label: 'Hot Take',      icon: '🔥' },
  { id: 'data',          label: 'Data',          icon: '📊' },
  { id: 'behind_scenes', label: 'Behind Scenes', icon: '🎬' },
  { id: 'question',      label: 'Question',      icon: '❓' },
  { id: 'bridging',      label: 'Bridging',      icon: '🌉' },
]

const INDUSTRIES = ['Aerospace', 'IT', 'Trucking', 'Drone', 'Business']
const VENTURES   = [{ value: '', label: 'Personal' }, { value: 'novizio', label: 'Novizio' }, { value: 'hourbour', label: 'Hourbour' }]

const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'
const inputStyle: React.CSSProperties = {
  background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.15)',
  borderRadius: 12, padding: '10px 14px', color: I1, fontSize: 13, width: '100%',
}

export default function CreativePanel({ topic, industry, toneSuggestion, onClose, onGoToCalendar }: CreativePanelProps) {
  const [selectedTone, setTone]     = useState(toneSuggestion ?? 'story')
  const [selectedInd, setInd]       = useState(industry)
  const [venture, setVenture]       = useState('')
  const [generating, setGenerating] = useState(false)
  const [draft, setDraft]           = useState('')
  const [schedDate, setSchedDate]   = useState('')
  const [saving, setSaving]         = useState(false)
  const [savedId, setSavedId]       = useState<string | null>(null)
  const [toast, setToast]           = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function generate() {
    setGenerating(true)
    setDraft('')
    setSavedId(null)
    const res  = await fetch('/api/content-lab/draft', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, industry_tag: selectedInd, tone: selectedTone, venture_slug: venture || null }),
    })
    const data = await res.json()
    setDraft(data.draft ?? '')
    setGenerating(false)
  }

  async function savePost(status: 'draft' | 'scheduled') {
    if (!draft.trim()) return
    setSaving(true)
    const res  = await fetch('/api/content-lab/posts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: draft, industry_tag: selectedInd,
        venture_slug: venture || null, tone: selectedTone,
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(8,16,36,0.40)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col"
        style={{ width: 500, background: 'rgba(252,253,255,0.98)', borderLeft: '1px solid rgba(12,44,82,0.10)', boxShadow: '-32px 0 80px rgba(12,44,82,0.18)', backdropFilter: 'blur(32px)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(12,44,82,0.08)', flexShrink: 0 }}>
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Creative Studio</span>
              <span className="text-[10px]" style={{ color: I1d }}>·</span>
              <span className="text-[10px] font-bold" style={{ color: I1d }}>LinkedIn Post</span>
            </div>
            <p className="text-[15px] font-bold leading-snug" style={{ color: I1 }}>{topic}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(12,44,82,0.08)' }}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ color: I1c }}>close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Controls */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <select style={{ ...inputStyle, flex: 1 }} value={selectedInd} onChange={e => setInd(e.target.value)}>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
              <select style={{ ...inputStyle, flex: 1 }} value={venture} onChange={e => setVenture(e.target.value)}>
                {VENTURES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
              </select>
            </div>

            {/* Tone picker */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: I1d }}>Tone</p>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                    style={{
                      background: selectedTone === t.id ? ACCENT : 'rgba(12,44,82,0.08)',
                      color:      selectedTone === t.id ? '#fff'  : I1c,
                    }}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={generating}
              className="w-full py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2"
              style={{ background: ACCENT, color: '#fff', opacity: generating ? 0.7 : 1 }}
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              {generating ? 'Writing your post…' : draft ? 'Regenerate' : 'Generate LinkedIn Post'}
            </button>
          </div>

          {/* Generated draft */}
          {(draft || generating) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: I1d }}>Your Post — edit freely</p>
                {draft && <span className="text-[11px]" style={{ color: I1d }}>{draft.length} chars</span>}
              </div>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={14}
                readOnly={generating}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75, fontFamily: 'inherit', minHeight: 260 }}
                placeholder={generating ? 'Writing…' : ''}
              />
            </div>
          )}

          {/* Save to Content Lab */}
          {draft && !generating && (
            <div className="flex flex-col gap-3 pb-2" style={{ borderTop: '1px solid rgba(12,44,82,0.08)', paddingTop: 20 }}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: I1d }}>Save to Content Lab</p>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={schedDate}
                  onChange={e => setSchedDate(e.target.value)}
                  style={{ ...inputStyle, width: 'auto', flex: 1 }}
                />
                <span className="text-[11px]" style={{ color: I1d }}>optional schedule date</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => savePost('draft')}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all"
                  style={{ background: 'rgba(12,44,82,0.08)', color: I1 }}
                >
                  Save Draft
                </button>
                <button
                  onClick={() => savePost('scheduled')}
                  disabled={saving || !schedDate}
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all"
                  style={{ background: 'rgba(0,102,204,0.12)', color: ACCENT, opacity: !schedDate ? 0.5 : 1 }}
                >
                  Schedule
                </button>
              </div>

              {savedId && (
                <button
                  onClick={() => { onClose(); onGoToCalendar() }}
                  className="w-full py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2"
                  style={{ background: '#059669', color: '#fff' }}
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  View in Post Calendar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div
            className="absolute bottom-6 left-6 right-6 px-4 py-3 rounded-2xl text-[12px] font-bold text-white text-center"
            style={{ background: '#059669', boxShadow: '0 8px 24px rgba(5,150,105,0.35)' }}
          >
            {toast}
          </div>
        )}
      </div>
    </>
  )
}
