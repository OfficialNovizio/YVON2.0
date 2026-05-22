'use client'

import { useEffect, useState } from 'react'
import { useSearchParams }  from 'next/navigation'
import FilterPanel, { FilterState } from './_filter-panel'
import JobsFeed           from './_jobs-feed'
import CompanyBrowser     from './_company-browser'
import Kanban             from './_kanban'
import ResumeVault        from './_resume-vault'
import Analytics          from './_analytics'
import ContentCalendar    from './_content-calendar'
import DraftStudio        from './_draft-studio'
import IdeaBank           from './_idea-bank'
import PostPerformance    from './_post-performance'
import Connections        from './_connections'
import Followups          from './_followups'
import InteractionLog     from './_interaction-log'
import IndustryRadar      from './_industry-radar'
import BrandScore        from './_brand-score'
import MorningBrief     from './_morning-brief'

// ── Main sections (top dark pill) ────────────────────────────────────────────
const MAIN_TABS = [
  { id: 'brief',   label: 'Morning Brief',  icon: 'wb_sunny'  },
  { id: 'career',  label: 'Career',         icon: 'work'      },
  { id: 'content', label: 'Content Lab',    icon: 'edit_note' },
  { id: 'network', label: 'Network CRM',    icon: 'group'     },
  { id: 'radar',   label: 'Industry Radar', icon: 'radar'     },
  { id: 'brand',   label: 'Brand Score',    icon: 'verified'  },
]

// ── Sub-nav per section (left sidebar) ───────────────────────────────────────
const SUB_TABS: Record<string, { id: string; label: string; icon: string }[]> = {
  brief: [
    { id: 'today',    label: "Today's Actions", icon: 'task_alt'    },
    { id: 'goals',    label: 'Weekly Goals',    icon: 'flag'        },
    { id: 'followups',label: 'Follow-ups',      icon: 'reply'       },
  ],
  career: [
    { id: 'jobs',      label: 'Jobs Feed',    icon: 'search'      },
    { id: 'companies', label: 'Companies',    icon: 'business'    },
    { id: 'kanban',    label: 'My Pipeline',  icon: 'view_kanban' },
    { id: 'resumes',   label: 'Resume Vault', icon: 'description' },
    { id: 'analytics', label: 'Analytics',    icon: 'bar_chart'   },
  ],
  content: [
    { id: 'calendar', label: 'Post Calendar', icon: 'calendar_month' },
    { id: 'drafts',   label: 'Drafts',        icon: 'draft'         },
    { id: 'ideas',    label: 'Idea Bank',     icon: 'lightbulb'     },
    { id: 'perf',     label: 'Performance',   icon: 'trending_up'   },
  ],
  network: [
    { id: 'connections', label: 'Connections',  icon: 'person_add'  },
    { id: 'followups',   label: 'Follow-ups',   icon: 'reply'       },
    { id: 'messages',    label: 'Messages',     icon: 'chat'        },
  ],
  radar: [
    { id: 'all',       label: 'All Industries', icon: 'public'     },
    { id: 'aerospace', label: 'Aerospace',      icon: 'flight'     },
    { id: 'it',        label: 'IT / Software',  icon: 'computer'   },
    { id: 'trucking',  label: 'Trucking',       icon: 'local_shipping' },
    { id: 'drone',     label: 'Drone / UAV',    icon: 'flight_takeoff' },
  ],
  brand: [
    { id: 'overview',  label: 'Overview',      icon: 'dashboard'   },
    { id: 'linkedin',  label: 'LinkedIn',      icon: 'person'      },
    { id: 'pipeline',  label: 'Applications',  icon: 'work'        },
  ],
}

const DEFAULT_SUBTAB: Record<string, string> = {
  brief: 'today', career: 'jobs', content: 'calendar',
  network: 'connections', radar: 'all', brand: 'overview',
}

const FILTER_TABS = new Set(['jobs', 'companies'])

const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.40)'
const G1 = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(32px) saturate(160%)',
  WebkitBackdropFilter: 'blur(32px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.55)',
  borderRadius: 18,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70), 0 8px 32px -8px rgba(12,44,82,0.12)',
}

const DEFAULT_FILTERS: FilterState = {
  industries: [], provinces: [], sizes: [], jobType: '', salaryMin: 0, postedDays: 0,
}

// ── Top dark pill ─────────────────────────────────────────────────────────────
function TopPill({
  tabs, active, onChange,
}: { tabs: typeof MAIN_TABS; active: string; onChange: (id: string) => void }) {
  return (
    <nav
      className="flex items-center gap-1.5 p-1.5 w-fit"
      style={{
        background: 'rgba(8,16,36,0.58)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 999,
        boxShadow: '0 1px 0 rgba(255,255,255,0.10) inset, 0 20px 40px -18px rgba(0,0,0,0.50), 0 4px 10px -4px rgba(0,0,0,0.30)',
      }}
    >
      {tabs.map(t => {
        const isActive = active === t.id
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="flex items-center gap-2 px-[18px] py-[9px] rounded-full text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-200"
            style={{
              color:      isActive ? '#0c0d10' : 'rgba(220,228,248,0.45)',
              background: isActive ? 'rgba(255,255,255,0.92)' : 'transparent',
            }}
          >
            <span className="material-symbols-outlined text-[14px]">{t.icon}</span>
            {t.label}
          </button>
        )
      })}
    </nav>
  )
}

// ── Left sidebar sub-nav ──────────────────────────────────────────────────────
function Sidebar({
  section, items, active, onChange,
}: {
  section: string
  items: { id: string; label: string; icon: string }[]
  active: string
  onChange: (id: string) => void
}) {
  const built = section === 'brief' || section === 'career' || section === 'content' || section === 'network' || section === 'radar' || section === 'brand'

  return (
    <div style={{ ...G1, padding: '8px', width: 196, flexShrink: 0 }}>
      {/* Section label */}
      <p
        className="px-3 pt-2 pb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: I1d }}
      >
        {MAIN_TABS.find(t => t.id === section)?.label}
      </p>

      {/* Nav items */}
      <div className="flex flex-col gap-0.5">
        {items.map(item => {
          const isActive  = active === item.id
          const isBuilt   = built || false
          return (
            <button
              key={item.id}
              onClick={() => isBuilt && onChange(item.id)}
              disabled={!isBuilt}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-left"
              style={{
                background: isActive && isBuilt
                  ? 'rgba(8,16,36,0.82)'
                  : 'transparent',
                color: isActive && isBuilt
                  ? '#ffffff'
                  : isBuilt ? I1c : I1d,
                cursor: isBuilt ? 'pointer' : 'default',
                opacity: isBuilt ? 1 : 0.5,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, color: isActive && isBuilt ? '#fff' : isBuilt ? I1c : I1d }}
              >
                {item.icon}
              </span>
              <span className="text-[13px] font-semibold flex-1">{item.label}</span>
              {!isBuilt && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,102,204,0.12)', color: '#0066cc' }}
                >
                  SOON
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Coming soon placeholder ───────────────────────────────────────────────────
function ComingSoon({ label, icon, description }: { label: string; icon: string; description: string }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: 400 }}>
      <div style={{ ...G1, padding: '48px 56px', textAlign: 'center', maxWidth: 480 }}>
        <span
          className="material-symbols-outlined text-[48px] mb-4"
          style={{ color: 'rgba(0,102,204,0.35)', display: 'block' }}
        >
          {icon}
        </span>
        <p className="text-[20px] font-bold mb-2" style={{ color: I1 }}>{label}</p>
        <p className="text-[13px] leading-relaxed" style={{ color: I1c }}>{description}</p>
        <span
          className="inline-block mt-5 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest"
          style={{ background: 'rgba(0,102,204,0.10)', color: '#0066cc' }}
        >
          Coming next
        </span>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PersonalPage() {
  const [mainTab, setMainTab]     = useState('career')
  const [subTabs, setSubTabs]     = useState<Record<string, string>>(DEFAULT_SUBTAB)
  const [filters, setFilters]     = useState<FilterState>(DEFAULT_FILTERS)
  const [linkedinConnected, setLinkedinConnected] = useState(false)
  const [prefillDate, setPrefillDate]             = useState('')
  const [prefillTopic, setPrefillTopic]           = useState('')

  const searchParams = useSearchParams()

  useEffect(() => {
    fetch('/api/linkedin/me')
      .then(r => r.json())
      .then(d => setLinkedinConnected(d.connected === true && !d.expired))
  }, [])

  // Handle LinkedIn OAuth redirect back
  useEffect(() => {
    if (searchParams.get('linkedin_connected') === '1') {
      setLinkedinConnected(true)
      setMainTab('content')
      setSubTabs(prev => ({ ...prev, content: 'drafts' }))
    }
  }, [searchParams])

  const activeSub   = subTabs[mainTab] ?? DEFAULT_SUBTAB[mainTab]
  const showFilter  = mainTab === 'career' && FILTER_TABS.has(activeSub)

  function handleMainTab(id: string) {
    setMainTab(id)
  }

  function handleSubTab(id: string) {
    setSubTabs(prev => ({ ...prev, [mainTab]: id }))
  }

  // Calendar slot clicked → open Draft Studio with that date prefilled
  function handleDraftDay(date: string) {
    setPrefillDate(date)
    setPrefillTopic('')
    setSubTabs(prev => ({ ...prev, content: 'drafts' }))
  }

  // Idea Bank "Draft" clicked → open Draft Studio with that topic prefilled
  function handleDraftIdea(topic: string) {
    setPrefillTopic(topic)
    setPrefillDate('')
    setSubTabs(prev => ({ ...prev, content: 'drafts' }))
  }

  // Creative panel "View in Post Calendar" → switch to calendar sub-tab
  function handleGoToCalendar() {
    setMainTab('content')
    setSubTabs(prev => ({ ...prev, content: 'calendar' }))
  }

  return (
    <main className="max-w-[1480px] 2xl:max-w-[min(92vw,2000px)] mx-auto px-7 pb-10 pt-[96px]">

      {/* Page header */}
      <div className="mb-5">
        <div
          className="flex items-center gap-2 mb-1.5"
          style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: I1d }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#0066cc' }} />
          Personal · YVON OS
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.025em', margin: 0, color: I1, lineHeight: 1 }}>
          Personal<span style={{ color: '#0066cc' }}>.</span>
        </h1>
      </div>

      {/* Top dark pill — main sections */}
      <TopPill tabs={MAIN_TABS} active={mainTab} onChange={handleMainTab} />

      {/* Body: sidebar + (filter) + content */}
      <div className="flex gap-4 items-start mt-5">

        {/* Left sidebar — sub-nav for active section */}
        <Sidebar
          section={mainTab}
          items={SUB_TABS[mainTab] ?? []}
          active={activeSub}
          onChange={handleSubTab}
        />

        {/* Optional filter panel (Jobs Feed / Companies only) */}
        {showFilter && (
          <FilterPanel filters={filters} onChange={setFilters} />
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Career sub-pages */}
          {mainTab === 'career' && activeSub === 'jobs'      && <JobsFeed filters={filters} />}
          {mainTab === 'career' && activeSub === 'companies' && <CompanyBrowser filters={filters} />}
          {mainTab === 'career' && activeSub === 'kanban'    && <Kanban />}
          {mainTab === 'career' && activeSub === 'resumes'   && <ResumeVault />}
          {mainTab === 'career' && activeSub === 'analytics' && <Analytics />}

          {/* Content Lab sub-pages */}
          {mainTab === 'content' && activeSub === 'calendar' && (
            <ContentCalendar onDraftDay={handleDraftDay} />
          )}
          {mainTab === 'content' && activeSub === 'drafts' && (
            <DraftStudio
              prefillDate={prefillDate}
              prefillTopic={prefillTopic}
              linkedinConnected={linkedinConnected}
            />
          )}
          {mainTab === 'content' && activeSub === 'ideas' && (
            <IdeaBank onDraftIdea={handleDraftIdea} onGoToCalendar={handleGoToCalendar} />
          )}
          {mainTab === 'content' && activeSub === 'perf' && (
            <PostPerformance />
          )}

          {/* Morning Brief */}
          {mainTab === 'brief' && (
            <MorningBrief activeSub={activeSub} />
          )}
          {/* Network CRM sub-pages */}
          {mainTab === 'network' && activeSub === 'connections' && <Connections />}
          {mainTab === 'network' && activeSub === 'followups'   && <Followups />}
          {mainTab === 'network' && activeSub === 'messages'    && <InteractionLog />}
          {/* Industry Radar — sidebar tab = active industry filter */}
          {mainTab === 'radar' && (
            <IndustryRadar industry={activeSub} onGoToCalendar={handleGoToCalendar} />
          )}
          {mainTab === 'brand' && (
            <BrandScore activeSub={activeSub} />
          )}
        </div>
      </div>
    </main>
  )
}
