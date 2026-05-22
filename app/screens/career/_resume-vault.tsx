'use client'

import { useEffect, useRef, useState } from 'react'

interface Resume {
  id: string
  name: string
  industry_tag: string
  file_url: string
  version: number
  analysis_json: Record<string, unknown> | null
  created_at: string
}

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18 }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'
const INDUSTRIES = ['Aerospace', 'IT', 'Trucking', 'Drone', 'Business', 'General']

export default function ResumeVault() {
  const [resumes, setResumes]     = useState<Resume[]>([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [selected, setSelected]   = useState<Resume | null>(null)
  const [jobDesc, setJobDesc]     = useState('')
  const [matchResult, setMatchResult] = useState<Record<string, unknown> | null>(null)
  const [matchLoading, setMatchLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadForm, setUploadForm] = useState({ name: '', industry_tag: 'Aerospace' })

  async function load() {
    setLoading(true)
    const res  = await fetch('/api/jobs/resumes')
    const data = await res.json()
    setResumes(data.resumes ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleUpload() {
    const file = fileRef.current?.files?.[0]
    if (!file || !uploadForm.name) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('name', uploadForm.name)
    form.append('industry_tag', uploadForm.industry_tag)

    const res  = await fetch('/api/jobs/resumes', { method: 'POST', body: form })
    const data = await res.json()
    if (data.resume) {
      setResumes(prev => [data.resume, ...prev])
      setUploadForm({ name: '', industry_tag: 'Aerospace' })
      if (fileRef.current) fileRef.current.value = ''
    }
    setUploading(false)
  }

  async function analyzeResume(resume: Resume) {
    setAnalyzing(resume.id)
    const res  = await fetch('/api/jobs/analyze-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_id: resume.id }),
    })
    const data = await res.json()
    if (data.analysis) {
      setResumes(prev => prev.map(r => r.id === resume.id ? { ...r, analysis_json: data.analysis } : r))
      if (selected?.id === resume.id) setSelected(prev => prev ? { ...prev, analysis_json: data.analysis } : null)
    }
    setAnalyzing(null)
  }

  async function matchAgainstJob() {
    if (!selected || !jobDesc.trim()) return
    setMatchLoading(true)
    setMatchResult(null)
    const res  = await fetch('/api/jobs/analyze-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_id: selected.id, job_description: jobDesc }),
    })
    const data = await res.json()
    if (data.analysis) setMatchResult(data.analysis)
    setMatchLoading(false)
  }

  async function deleteResume(id: string) {
    if (!confirm('Delete this resume?')) return
    await fetch(`/api/jobs/resumes?id=${id}`, { method: 'DELETE' })
    setResumes(prev => prev.filter(r => r.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const inputStyle = { background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.15)', borderRadius: 10, padding: '8px 12px', color: I1, fontSize: 13, width: '100%' }

  return (
    <div className="flex-1 flex gap-5" style={{ minHeight: 0 }}>
      {/* Left: resume list + upload */}
      <div className="flex flex-col gap-4" style={{ width: 300, flexShrink: 0 }}>
        {/* Upload card */}
        <div style={{ ...G1, padding: 20 }}>
          <p className="text-[13px] font-bold mb-3" style={{ color: I1 }}>Upload Resume</p>
          <div className="flex flex-col gap-3">
            <input style={inputStyle} placeholder="Resume name" value={uploadForm.name} onChange={e => setUploadForm(p => ({ ...p, name: e.target.value }))} />
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={uploadForm.industry_tag} onChange={e => setUploadForm(p => ({ ...p, industry_tag: e.target.value }))}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
            <input ref={fileRef} type="file" accept=".pdf,.docx" className="text-[12px]" style={{ color: I1c }} />
            <button
              onClick={handleUpload}
              disabled={uploading || !uploadForm.name}
              className="py-2.5 rounded-xl text-[12px] font-bold transition-all"
              style={{ background: '#0066cc', color: '#fff', opacity: uploading || !uploadForm.name ? 0.6 : 1 }}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Resume list */}
        <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)', scrollbarWidth: 'thin' }}>
          {loading && <p style={{ color: I1c, fontSize: 13 }}>Loading resumes…</p>}
          {!loading && resumes.length === 0 && (
            <div style={{ ...G1, padding: 20, textAlign: 'center' }}>
              <p style={{ color: I1d, fontSize: 13 }}>No resumes yet. Upload your first one.</p>
            </div>
          )}
          {resumes.map(r => (
            <div
              key={r.id}
              onClick={() => { setSelected(r); setMatchResult(null); setJobDesc('') }}
              style={{ ...G1, padding: '12px 14px', cursor: 'pointer', outline: selected?.id === r.id ? `2px solid ${ACCENT}` : 'none' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold leading-tight" style={{ color: I1 }}>{r.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: I1d }}>{r.industry_tag} · v{r.version} · {new Date(r.created_at).toLocaleDateString()}</p>
                  {r.analysis_json && (
                    <p className="text-[10px] font-semibold mt-1" style={{ color: '#059669' }}>
                      ATS {(r.analysis_json.ats_score as number) ?? 0}% · Analysed ✓
                    </p>
                  )}
                </div>
                <button onClick={e => { e.stopPropagation(); deleteResume(r.id) }}>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: 'rgba(220,38,38,0.6)' }}>delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: resume detail */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)', scrollbarWidth: 'thin' }}>
        {!selected ? (
          <div style={{ ...G1, padding: 40, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined text-[48px] mb-3" style={{ color: I1d }}>description</span>
            <p className="text-[14px] font-medium" style={{ color: I1c }}>Select a resume to view analysis</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ ...G1, padding: '16px 20px' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[18px] font-bold" style={{ color: I1 }}>{selected.name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: I1d }}>{selected.industry_tag} · v{selected.version}</p>
                </div>
                <div className="flex gap-3">
                  <a href={selected.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold" style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    View PDF
                  </a>
                  <button
                    onClick={() => analyzeResume(selected)}
                    disabled={analyzing === selected.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold"
                    style={{ background: '#0066cc', color: '#fff', opacity: analyzing === selected.id ? 0.7 : 1 }}
                  >
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    {analyzing === selected.id ? 'Analysing…' : selected.analysis_json ? 'Re-analyse' : 'Analyse'}
                  </button>
                </div>
              </div>
            </div>

            {/* General analysis */}
            {selected.analysis_json && (
              <div style={{ ...G1, padding: '18px 20px' }}>
                <p className="text-[12px] font-bold uppercase tracking-wider mb-4" style={{ color: I1d }}>Resume Analysis</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(0,102,204,0.08)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: I1d }}>ATS Score</p>
                    <p className="text-[28px] font-bold" style={{ color: ACCENT }}>{selected.analysis_json.ats_score as number ?? 0}<span className="text-[14px]">%</span></p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(5,150,105,0.08)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: I1d }}>Experience</p>
                    <p className="text-[28px] font-bold" style={{ color: '#059669' }}>{selected.analysis_json.experience_years as number ?? 0}<span className="text-[14px]">yr</span></p>
                  </div>
                </div>

                {typeof selected.analysis_json.summary === 'string' && (
                  <p className="text-[13px] leading-relaxed mb-4 p-3 rounded-xl" style={{ color: I1c, background: 'rgba(12,44,82,0.04)' }}>{selected.analysis_json.summary}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {(['strengths', 'weaknesses'] as const).map(key => (
                    <div key={key}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: key === 'strengths' ? '#059669' : '#dc2626' }}>
                        {key === 'strengths' ? '✓ Strengths' : '✗ Weaknesses'}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {(Array.isArray(selected.analysis_json![key]) ? selected.analysis_json![key] as string[] : []).map((item: string, i: number) => (
                          <li key={i} className="text-[11px] leading-relaxed" style={{ color: I1c }}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {(selected.analysis_json.suggestions as string[])?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: I1d }}>Suggestions</p>
                    <ul className="flex flex-col gap-1.5">
                      {(selected.analysis_json.suggestions as string[]).map((s, i) => (
                        <li key={i} className="text-[12px] leading-relaxed p-2 rounded-xl" style={{ color: I1c, background: 'rgba(0,102,204,0.06)' }}>→ {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Job match section */}
            <div style={{ ...G1, padding: '18px 20px' }}>
              <p className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: I1d }}>Match Against Job</p>
              <textarea
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                placeholder="Paste the job description here…"
                rows={5}
                style={{ ...{ background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.15)', borderRadius: 10, padding: '10px 14px', color: I1, fontSize: 13, width: '100%', resize: 'vertical' } }}
              />
              <button
                onClick={matchAgainstJob}
                disabled={!jobDesc.trim() || matchLoading}
                className="mt-3 w-full py-2.5 rounded-xl text-[13px] font-bold transition-all"
                style={{ background: '#0066cc', color: '#fff', opacity: !jobDesc.trim() || matchLoading ? 0.6 : 1 }}
              >
                {matchLoading ? 'Analysing match…' : 'Check Match Score'}
              </button>

              {matchResult && (
                <div className="mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(12,44,82,0.10)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${matchResult.match_score as number}%`, background: (matchResult.match_score as number) >= 70 ? '#059669' : (matchResult.match_score as number) >= 50 ? '#d97706' : '#dc2626' }} />
                    </div>
                    <p className="text-[22px] font-bold shrink-0" style={{ color: (matchResult.match_score as number) >= 70 ? '#059669' : '#d97706' }}>
                      {matchResult.match_score as number}%
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#059669' }}>Strong Matches</p>
                      {((matchResult.strong_matches as string[]) ?? []).map((m, i) => <p key={i} className="text-[11px] leading-relaxed" style={{ color: I1c }}>✓ {m}</p>)}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#dc2626' }}>Missing Keywords</p>
                      {((matchResult.missing_keywords as string[]) ?? []).map((m, i) => <p key={i} className="text-[11px] leading-relaxed" style={{ color: I1c }}>✗ {m}</p>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
