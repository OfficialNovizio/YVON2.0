'use client'

import { useEffect, useState, useCallback } from 'react'
import { FilterState } from './_filter-panel'

interface Company {
  id: string
  name: string
  domain: string
  industry: string
  province: string
  size: string
  description: string
  careers_url: string
  is_watching: boolean
  open_roles: number
}

interface CompanyBrowserProps { filters: FilterState }

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18 }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const ACCENT = '#0066cc'

const SIZE_LABEL: Record<string, string> = { startup: 'Startup', small: 'Small', medium: 'Medium', large: 'Large', enterprise: 'Enterprise' }
const SIZE_COLOR: Record<string, string> = { startup: '#7c3aed', small: '#059669', medium: '#d97706', large: '#0066cc', enterprise: '#dc2626' }
const INDUSTRY_ICONS: Record<string, string> = { Aerospace: '✈️', IT: '💻', Trucking: '🚛', Drone: '🛸', Business: '📊' }

export default function CompanyBrowser({ filters }: CompanyBrowserProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading]     = useState(true)
  const [watchOnly, setWatchOnly] = useState(false)
  const [profile, setProfile]     = useState<Company | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.industries.length) params.set('industries', filters.industries.join(','))
    if (filters.provinces.length)  params.set('provinces',  filters.provinces.join(','))
    if (filters.sizes.length)      params.set('sizes',      filters.sizes.join(','))
    if (watchOnly)                 params.set('watching',   'true')

    const res  = await fetch(`/api/jobs/companies?${params}`)
    const data = await res.json()
    setCompanies(data.companies ?? [])
    setLoading(false)
  }, [filters, watchOnly])

  useEffect(() => { fetchCompanies() }, [fetchCompanies])

  async function toggleWatch(company: Company) {
    setTogglingId(company.id)
    const newVal = !company.is_watching
    await fetch('/api/jobs/companies', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: company.id, is_watching: newVal }),
    })
    setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, is_watching: newVal } : c))
    if (profile?.id === company.id) setProfile(prev => prev ? { ...prev, is_watching: newVal } : null)
    setTogglingId(null)
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><p style={{ color: I1c }}>Loading companies…</p></div>

  // Company profile modal
  if (profile) {
    return (
      <div className="flex-1 flex flex-col gap-4">
        <button
          onClick={() => setProfile(null)}
          className="flex items-center gap-2 text-[12px] font-semibold"
          style={{ color: ACCENT }}
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to companies
        </button>

        <div style={{ ...G1, padding: 28 }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.10)' }}>
                {profile.domain ? (
                  <img src={`https://logo.clearbit.com/${profile.domain}`} alt="" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <span className="text-[32px]">{INDUSTRY_ICONS[profile.industry] ?? '🏢'}</span>
                )}
              </div>
              <div>
                <p className="text-[22px] font-bold" style={{ color: I1 }}>{profile.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[12px]">{INDUSTRY_ICONS[profile.industry]} {profile.industry}</span>
                  <span style={{ color: I1d }}>·</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: SIZE_COLOR[profile.size] ?? I1d, background: `${SIZE_COLOR[profile.size]}18` }}>{SIZE_LABEL[profile.size]}</span>
                  <span style={{ color: I1d }}>·</span>
                  <span className="text-[12px]" style={{ color: I1d }}>📍 {profile.province}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => toggleWatch(profile)}
                disabled={togglingId === profile.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
                style={{
                  background: profile.is_watching ? 'rgba(5,150,105,0.12)' : 'rgba(0,102,204,0.10)',
                  color: profile.is_watching ? '#059669' : ACCENT,
                  border: `1px solid ${profile.is_watching ? 'rgba(5,150,105,0.25)' : 'rgba(0,102,204,0.20)'}`,
                }}
              >
                <span className="material-symbols-outlined text-[16px]">{profile.is_watching ? 'star' : 'star_border'}</span>
                {profile.is_watching ? 'Watching' : 'Watch'}
              </button>
              {profile.careers_url && (
                <a href={profile.careers_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold" style={{ background: '#0066cc', color: '#fff' }}>
                  Careers Page →
                </a>
              )}
            </div>
          </div>

          {profile.description && (
            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: I1d }}>About</p>
              <p className="text-[13px] leading-relaxed" style={{ color: I1c }}>{profile.description}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold" style={{ color: I1 }}>{companies.length} companies</p>
        <button
          onClick={() => setWatchOnly(!watchOnly)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all"
          style={{
            background: watchOnly ? 'rgba(5,150,105,0.12)' : 'rgba(12,44,82,0.06)',
            color: watchOnly ? '#059669' : I1c,
            border: watchOnly ? '1px solid rgba(5,150,105,0.25)' : '1px solid transparent',
          }}
        >
          <span className="material-symbols-outlined text-[16px]">{watchOnly ? 'star' : 'star_border'}</span>
          {watchOnly ? 'Watchlist only' : 'Show watchlist'}
        </button>
      </div>

      {companies.length === 0 && (
        <div style={{ ...G1, padding: 32, textAlign: 'center' }}>
          <span className="material-symbols-outlined text-[36px] mb-2" style={{ color: I1d }}>business</span>
          <p className="text-[14px] font-medium" style={{ color: I1c }}>No companies match your filters</p>
        </div>
      )}

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {companies.map(co => (
          <div key={co.id} style={{ ...G1, padding: '16px 18px' }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0" style={{ background: 'rgba(12,44,82,0.06)', border: '1px solid rgba(12,44,82,0.10)' }}>
                {co.domain ? (
                  <img src={`https://logo.clearbit.com/${co.domain}`} alt="" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <span className="text-[20px]">{INDUSTRY_ICONS[co.industry] ?? '🏢'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold leading-tight" style={{ color: I1 }}>{co.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: SIZE_COLOR[co.size] ?? I1d, background: `${SIZE_COLOR[co.size] ?? '#ccc'}18` }}>{SIZE_LABEL[co.size]}</span>
                  <span className="text-[10px]" style={{ color: I1d }}>📍 {co.province}</span>
                </div>
              </div>
              <button
                onClick={() => toggleWatch(co)}
                disabled={togglingId === co.id}
                title={co.is_watching ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ color: co.is_watching ? '#059669' : I1d }}>{co.is_watching ? 'star' : 'star_border'}</span>
              </button>
            </div>

            {co.description && (
              <p className="text-[12px] leading-relaxed mb-3" style={{ color: I1c, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {co.description}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setProfile(co)}
                className="flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                style={{ background: 'rgba(0,102,204,0.10)', color: ACCENT }}
              >
                View Profile
              </button>
              {co.careers_url && (
                <a href={co.careers_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-xl flex items-center" style={{ background: '#0066cc' }}>
                  <span className="material-symbols-outlined text-[14px] text-white">open_in_new</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
