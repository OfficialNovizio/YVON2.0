'use client';

import type { TabId } from './page';

const INK    = '#0c0d10';
const INK_2  = 'rgba(12,13,16,0.62)';
const INK_4  = 'rgba(12,13,16,0.42)';
const ACCENT = '#0066cc';
const GREEN  = '#059669';

const TICKER_ITEMS = [
  { text: 'Instagram engagement', delta: '−18%', sub: 'vs 7-day avg', dir: 'neg' },
  { text: 'TikTok CPM',           delta: '−8%',  sub: 'this week',    dir: 'pos' },
  { text: 'Novizio brand pulse',  delta: '+2 pts', sub: 'MoM',        dir: 'pos' },
  { text: 'Hourbour search share',delta: '+11%',  sub: 'WoW',         dir: 'pos' },
  { text: 'Reformation Gen-Z intent', delta: '+12%', sub: 'lead',     dir: 'neg' },
  { text: 'FB ROAS',              delta: '−0.7×', sub: 'WoW',         dir: 'neg' },
  { text: 'Newsletter CTR',       delta: '+3.1%', sub: 'WoW',         dir: 'pos' },
  { text: 'Returns rate',         delta: '+0.4%', sub: 'MoM',         dir: 'neg' },
];

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      className="relative flex items-center overflow-hidden"
      style={{
        height: 38, borderRadius: 999,
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(22px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.65)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 0 0 1px rgba(255,255,255,0.5) inset, 0 4px 12px -4px rgba(20,24,40,0.10)',
      }}
    >
      {/* Live badge */}
      <div
        className="flex-none flex items-center gap-2 px-4"
        style={{ height: '100%', borderRight: '1px solid rgba(12,13,16,0.07)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: INK_2 }}
      >
        <span className="ceo-live-dot" />
        <span>Live</span>
      </div>

      {/* Scrolling track */}
      <div
        className="flex-1 h-full overflow-hidden relative"
        style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)' }}
      >
        <div
          className="ceo-ticker-track flex items-center gap-7 h-full"
          style={{ width: 'max-content', paddingInline: 28, fontSize: 12, color: '#2a2c33', fontWeight: 500 }}
        >
          {items.map((it, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              <span>{it.text} </span>
              <span style={{ color: it.dir === 'neg' ? '#dc2626' : GREEN, fontWeight: 600 }}>{it.delta}</span>
              <span style={{ opacity: 0.5 }}> · {it.sub}</span>
              <span className="mx-3.5 w-1 h-1 rounded-full flex-none" style={{ background: 'rgba(12,13,16,0.22)' }} />
            </span>
          ))}
        </div>
      </div>

      {/* Right label */}
      <div
        className="flex-none flex items-center gap-2.5 px-4"
        style={{ height: '100%', borderLeft: '1px solid rgba(12,13,16,0.07)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: INK_4, textTransform: 'uppercase' }}
      >
        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(12,13,16,0.06)', color: '#2a2c33', letterSpacing: '0.14em' }}>13 sources</span>
        <span>06:42 AM PT</span>
      </div>
    </div>
  );
}

function PageHead() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <div className="flex justify-between items-end gap-6 mt-[18px]">
      <div>
        <div className="flex items-center gap-2 mb-1.5" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: INK_4 }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#6c5ce7' }} />
          CEO Command · YVON OS
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em', margin: 0, color: INK, lineHeight: 1 }}>
          Command Center<span style={{ color: ACCENT }}>.</span>
        </h1>
      </div>
      <div className="text-right flex flex-col gap-1">
        <p style={{ fontSize: 14, fontWeight: 500, color: '#2a2c33' }}>{today}</p>
        <p className="flex items-center justify-end gap-1.5" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GREEN }}>
          <span className="ceo-live-dot" style={{ background: GREEN }} />
          Next refresh 06:00 AM
        </p>
      </div>
    </div>
  );
}

const TABS: { id: TabId; label: string; badge?: boolean }[] = [
  { id: 'overview',  label: 'Overview' },
  { id: 'situation', label: 'Situation' },
  { id: 'act',       label: 'Act', badge: true },
  { id: 'done',      label: 'Done' },
  { id: 'context',   label: 'Context' },
];

function TabStrip({ active, onChange, actCount }: { active: TabId; onChange: (t: TabId) => void; actCount: number }) {
  return (
    <nav
      className="flex items-center gap-1.5 mt-[22px] p-1.5 w-fit"
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(22px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.65)',
        borderRadius: 999,
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 0 0 1px rgba(255,255,255,0.5) inset, 0 4px 12px -4px rgba(20,24,40,0.10)',
      }}
    >
      {TABS.map(t => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={`flex items-center gap-2 px-[18px] py-[9px] rounded-full text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-200 ${active === t.id ? 'ceo-tab-active' : ''}`}
          style={{ color: active === t.id ? '#fff' : INK_4, border: 'none', background: active === t.id ? INK : 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {t.label}
          {t.badge && actCount > 0 && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center" style={{ background: '#dc2626', color: '#fff', letterSpacing: '0.05em' }}>
              ●{actCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

interface CeoHeaderProps {
  active: TabId;
  onChange: (t: TabId) => void;
  actCount: number;
}

export default function CeoHeader({ active, onChange, actCount }: CeoHeaderProps) {
  return (
    <header>
      <Ticker />
      <PageHead />
      <TabStrip active={active} onChange={onChange} actCount={actCount} />
    </header>
  );
}
