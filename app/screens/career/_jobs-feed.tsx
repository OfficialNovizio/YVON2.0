'use client'

import { useEffect, useState, useCallback } from 'react'
import { FilterState } from './_filter-panel'

interface Job {
  id: string
  title: string
  company: string
  company_domain: string
  industry: string
  province: string
  location_type: string
  salary_min?: number
  salary_max?: number
  job_url: string
  source: string
  posted_date: string
  description: string
}

interface JobsFeedProps { filters: FilterState }

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18 }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const INDUSTRY_ICONS: Record<string, string> = {
  Aerospace: '✈️', IT: '💻', Trucking: '🚛', Drone: '🛸', Business: '📊',
}

function salaryLabel(min?: number, max?: number) {
  if (!min && !max) return null
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `${fmt(min)}+`
  return `Up to ${fmt(max!)}`
}

function locationBadge(type: string) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    remote: { label: 'Remote', color: '#059669', bg: 'rgba(5,150,105,0.12)' },
    hybrid: { label: 'Hybrid', color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
    onsite: { label: 'On-site', color: I1d, bg: 'rgba(12,44,82,0.08)' },
  }
  const v = map[type] ?? map.onsite
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: v.color, background: v.bg }}>{v.label}</span>
}

export default function JobsFeed({ filters }: JobsFeedProps) {
  const [jobs, setJobs]     = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [demo, setDemo]     = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved]   = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.industries.length) params.set('industries', filters.industries.join(','))
    if (filters.provinces.length)  params.set('provinces',  filters.provinces.join(','))
    if (filters.sizes.length)      params.set('sizes',      filters.sizes.join(','))
    if (filters.jobType)           params.set('jobType',    filters.jobType)
    if (filters.salaryMin > 0)     params.set('salaryMin',  String(filters.salaryMin))

    try {
      const res  = await fetch(`/api/jobs/search?${params}`)
      const data = await res.json()
      setJobs(data.jobs ?? [])
      setDemo(data.demo ?? false)
    } catch { setJobs([]) }
    finally  { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  async function saveToKanban(job: Job) {
    setSaving(job.id)
    try {
      await fetch('/api/jobs/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: job.title, company: job.company, company_domain: job.company_domain,
          industry: job.industry, province: job.province, location_type: job.location_type,
          salary_min: job.salary_min, salary_max: job.salary_max,
          source: job.source, job_url: job.job_url, status: 'saved',
        }),
      })
      setSaved(prev => new Set([...prev, job.id]))
    } finally { setSaving(null) }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-[40px] mb-2" style={{ color: ACCENT }}>search</span>
          <p className="text-[14px] font-medium" style={{ color: I1c }}>Searching jobs across Canada…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold" style={{ color: I1 }}>
          {jobs.length} role{jobs.length !== 1 ? 's' : ''} found
        </p>
        {demo && (
          <span className="text-[11px] font-bold px-3 py-1 rounded-full" style={{ color: '#d97706', background: 'rgba(217,119,6,0.12)' }}>
            Demo data · Add Adzuna API key for live results
          </span>
        )}
      </div>

      {jobs.length === 0 && (
        <div style={{ ...G1, padding: 32, textAlign: 'center' }}>
          <span className="material-symbols-outlined text-[36px] mb-2" style={{ color: I1d }}>work_off</span>
          <p className="text-[14px] font-medium" style={{ color: I1c }}>No jobs match your current filters</p>
          <p className="text-[12px] mt-1" style={{ color: I1d }}>Try removing some filters or selecting different industries</p>
        </div>
      )}

      {jobs.map(job => (
        <div key={job.id} style={{ ...G1, padding: '16px 20px' }}>
          <div className="flex items-start gap-3">
            {/* Company logo */}
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style={{ background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.10)' }}>
              {job.company_domain ? (
                <img src={`https://logo.clearbit.com/${job.company_domain}`} alt="" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              ) : (
                <span className="text-[20px]">{INDUSTRY_ICONS[job.industry] ?? '🏢'}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-bold leading-tight" style={{ color: I1 }}>{job.title}</p>
                  <p className="text-[12px] font-semibold mt-0.5" style={{ color: I1c }}>{job.company}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => saveToKanban(job)}
                    disabled={saved.has(job.id) || saving === job.id}
                    className="text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
                    style={{
                      background: saved.has(job.id) ? 'rgba(5,150,105,0.15)' : 'rgba(0,102,204,0.10)',
                      color: saved.has(job.id) ? '#059669' : ACCENT,
                      border: `1px solid ${saved.has(job.id) ? 'rgba(5,150,105,0.25)' : 'rgba(0,102,204,0.20)'}`,
                      opacity: saving === job.id ? 0.6 : 1,
                    }}
                  >
                    {saving === job.id ? '…' : saved.has(job.id) ? '✓ Saved' : 'Save'}
                  </button>
                  {job.job_url && (
                    <a
                      href={job.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
                      style={{ background: '#0066cc', color: '#fff' }}
                    >
                      Apply →
                    </a>
                  )}
                </div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] font-medium" style={{ color: I1d }}>{INDUSTRY_ICONS[job.industry]} {job.industry}</span>
                <span style={{ color: I1d }}>·</span>
                <span className="text-[11px] font-medium" style={{ color: I1d }}>📍 {job.province}</span>
                {locationBadge(job.location_type)}
                {salaryLabel(job.salary_min, job.salary_max) && (
                  <>
                    <span style={{ color: I1d }}>·</span>
                    <span className="text-[11px] font-semibold" style={{ color: '#059669' }}>{salaryLabel(job.salary_min, job.salary_max)}</span>
                  </>
                )}
                <span style={{ color: I1d }}>·</span>
                <span className="text-[10px]" style={{ color: I1d }}>{job.source} · {job.posted_date}</span>
              </div>

              {/* Description toggle */}
              {job.description && (
                <div className="mt-2">
                  <p className="text-[12px] leading-relaxed" style={{ color: I1c, display: expanded === job.id ? undefined : '-webkit-box', WebkitLineClamp: expanded === job.id ? undefined : 2, WebkitBoxOrient: 'vertical', overflow: expanded === job.id ? undefined : 'hidden' }}>
                    {job.description}
                  </p>
                  <button
                    onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                    className="text-[11px] font-semibold mt-1"
                    style={{ color: ACCENT }}
                  >
                    {expanded === job.id ? 'Show less' : 'Show more'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
