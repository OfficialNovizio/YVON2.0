'use client'

export interface FilterState {
  industries: string[]
  provinces:  string[]
  sizes:      string[]
  jobType:    string
  salaryMin:  number
  postedDays: number
}

interface FilterPanelProps {
  filters:   FilterState
  onChange:  (f: FilterState) => void
}

const INDUSTRIES = ['Aerospace', 'IT', 'Trucking', 'Drone', 'Business']
const PROVINCES  = [
  { code: 'ON', label: 'Ontario' }, { code: 'BC', label: 'British Columbia' },
  { code: 'AB', label: 'Alberta' }, { code: 'QC', label: 'Quebec' },
  { code: 'MB', label: 'Manitoba' }, { code: 'SK', label: 'Saskatchewan' },
  { code: 'NS', label: 'Nova Scotia' }, { code: 'NB', label: 'New Brunswick' },
  { code: 'Remote', label: '🌐 Remote' },
]
const SIZES   = ['startup', 'small', 'medium', 'large', 'enterprise']
const TYPES   = [{ value: '', label: 'Any' }, { value: 'full-time', label: 'Full-time' }, { value: 'part-time', label: 'Part-time' }, { value: 'contract', label: 'Contract' }]
const SALARY  = [0, 40000, 60000, 80000, 100000, 120000, 150000]

const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18 }
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch })

  function Checkbox({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 text-left w-full transition-opacity"
        style={{ opacity: checked ? 1 : 0.7 }}
      >
        <span
          className="w-4 h-4 rounded flex items-center justify-center shrink-0"
          style={{ background: checked ? '#0066cc' : 'rgba(12,44,82,0.10)', border: checked ? 'none' : '1px solid rgba(12,44,82,0.25)' }}
        >
          {checked && <span className="material-symbols-outlined text-white" style={{ fontSize: 12 }}>check</span>}
        </span>
        <span className="text-[12px] font-medium" style={{ color: I1 }}>{label}</span>
      </button>
    )
  }

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: I1d }}>{title}</p>
        <div className="flex flex-col gap-1.5">{children}</div>
      </div>
    )
  }

  const hasFilters = filters.industries.length || filters.provinces.length || filters.sizes.length || filters.jobType || filters.salaryMin > 0

  return (
    <div style={{ ...G1, padding: '20px 16px', width: 220, flexShrink: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-bold" style={{ color: I1 }}>Filters</p>
        {hasFilters && (
          <button
            onClick={() => onChange({ industries: [], provinces: [], sizes: [], jobType: '', salaryMin: 0, postedDays: 0 })}
            className="text-[11px] font-semibold"
            style={{ color: '#0066cc' }}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <Section title="Industry">
          {INDUSTRIES.map(i => (
            <Checkbox key={i} checked={filters.industries.includes(i)} label={i} onClick={() => set({ industries: toggle(filters.industries, i) })} />
          ))}
        </Section>

        <Section title="Province">
          {PROVINCES.map(p => (
            <Checkbox key={p.code} checked={filters.provinces.includes(p.code)} label={p.label} onClick={() => set({ provinces: toggle(filters.provinces, p.code) })} />
          ))}
        </Section>

        <Section title="Company Size">
          {SIZES.map(s => (
            <Checkbox key={s} checked={filters.sizes.includes(s)} label={s.charAt(0).toUpperCase() + s.slice(1)} onClick={() => set({ sizes: toggle(filters.sizes, s) })} />
          ))}
        </Section>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: I1d }}>Job Type</p>
          <div className="flex flex-col gap-1">
            {TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => set({ jobType: t.value })}
                className="text-left text-[12px] font-medium px-2 py-1 rounded-lg transition-all"
                style={{
                  color: filters.jobType === t.value ? '#fff' : I1,
                  background: filters.jobType === t.value ? '#0066cc' : 'transparent',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: I1d }}>
            Min Salary {filters.salaryMin > 0 ? `· $${(filters.salaryMin / 1000).toFixed(0)}k` : ''}
          </p>
          <input
            type="range" min={0} max={150000} step={10000}
            value={filters.salaryMin}
            onChange={e => set({ salaryMin: parseInt(e.target.value) })}
            className="w-full accent-[#0066cc]"
          />
          <div className="flex justify-between">
            <span className="text-[10px]" style={{ color: I1d }}>$0</span>
            <span className="text-[10px]" style={{ color: I1d }}>$150k+</span>
          </div>
        </div>
      </div>
    </div>
  )
}
