'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CompetitorSubNav from './_subnav';
import { useVentureSlug } from '@/lib/use-venture-slug';

// ── Glass variants ──────────────────────────────────────────────────────────────
const G1 = { background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 22, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.70),inset 0 -1px 0 rgba(255,255,255,0.10),0 18px 50px -10px rgba(20,60,120,0.28)' };
const I1 = '#0c2c52', I1c = 'rgba(12,44,82,0.65)', I1d = 'rgba(12,44,82,0.48)', L1 = 'rgba(12,44,82,0.10)';

const G2 = { background: 'linear-gradient(135deg,rgba(0,102,204,0.28),rgba(0,160,255,0.18))', backdropFilter: 'blur(32px) saturate(160%)', WebkitBackdropFilter: 'blur(32px) saturate(160%)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 22, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30),inset 0 -1px 0 rgba(0,0,0,0.10),0 18px 50px -10px rgba(0,60,160,0.40)' };
const I2 = '#f4f8ff', I2d = 'rgba(244,248,255,0.48)';

const G3 = { background: 'linear-gradient(135deg,rgba(15,22,38,0.58),rgba(8,14,28,0.72))', backdropFilter: 'blur(34px) saturate(140%)', WebkitBackdropFilter: 'blur(34px) saturate(140%)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 22, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18),inset 0 -1px 0 rgba(0,0,0,0.30),0 22px 60px -12px rgba(0,10,40,0.55)' };
const I3c = 'rgba(241,245,251,0.75)';

const G4 = { background: 'radial-gradient(120% 80% at 0% 0%,rgba(255,150,200,0.32),transparent 55%),radial-gradient(120% 80% at 100% 100%,rgba(120,200,255,0.40),transparent 55%),linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.12))', backdropFilter: 'blur(30px) saturate(200%)', WebkitBackdropFilter: 'blur(30px) saturate(200%)', border: '1px solid rgba(255,255,255,0.50)', borderRadius: 22, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.60),inset 0 -1px 0 rgba(255,255,255,0.10),0 18px 50px -10px rgba(180,80,160,0.30)' };
const I4 = '#2a1240', I4d = 'rgba(42,18,64,0.48)';

const ACCENT = '#0066cc';
const INK_4  = 'rgba(10,37,71,0.52)';

interface IntelData {
  signals: Array<{ id: string; severity: 'red' | 'amber' | 'green'; text: string; cta: string }>;
  kpis: Array<{ label: string; icon: string; value: string; unit: string; delta: string; up: boolean | null }>;
  competitors: Array<{ name: string; initial: string; sov: string; sentiment: string; sentUp: boolean | null; momentum: string; accent: boolean; dashed: boolean }>;
}

// ── Page ────────────────────────────────────────────────────────────────────────

export default function CompetitorPage() {
  const router = useRouter();
  const ventureSlug = useVentureSlug();
  const [data, setData] = useState<IntelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineMsg, setPipelineMsg] = useState('');

  useEffect(() => {
    if (!ventureSlug) return;
    setLoading(true);
    fetch(`/api/competitor-intelligence?venture=${ventureSlug}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ventureSlug]);

  function handleDiscover() {
    if (!ventureSlug) return;
    setPipelineRunning(true);
    setPipelineMsg('Finding competitors...');
    const ventureName = ventureSlug === 'hourbour' ? 'Hourbour' : 'Novizio';
    const industry = ventureSlug === 'hourbour' ? 'fintech' : 'fashion e-commerce';

    // Default competitors per venture (used when AI is unavailable)
    const DEFAULTS: Record<string, string[]> = {
      novizio: ['Zara', 'H&M', 'ASOS', 'Mango', 'Uniqlo'],
      hourbour: ['Monzo', 'Revolut', 'Starling Bank', 'Wise', 'Chime'],
    };

    // Try AI suggestions first, fall back to defaults
    fetch('/api/auto-competitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandName: ventureName, industry }),
    })
      .then(r => r.json())
      .then(suggestions => {
        let names: string[] = suggestions.competitors ?? [];
        if (names.length === 0) names = DEFAULTS[ventureSlug] ?? ['Zara', 'H&M', 'ASOS', 'Mango', 'Uniqlo'];
        return names;
      })
      .catch(() => DEFAULTS[ventureSlug] ?? ['Zara', 'H&M', 'ASOS', 'Mango', 'Uniqlo'])
      .then(names => {
        setPipelineMsg(`Scraping ${names.length} competitors...`);
        return fetch('/api/competitor-pipeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ventureSlug, competitors: names.map(n => ({ brandName: n })) }),
        });
      })
      .then(r => r.json())
      .then(d => {
        if (d?.error) { setPipelineMsg(`Error: ${d.error}`); setPipelineRunning(false); return; }
        const count = d?.results?.length ?? 0;
        setPipelineMsg(`Done! ${count} competitor${count !== 1 ? 's' : ''} scraped. Refreshing...`);
        setTimeout(() => {
          fetch(`/api/competitor-intelligence?venture=${ventureSlug}`)
            .then(r => r.json())
            .then(d => setData(d))
            .catch(() => {})
            .finally(() => { setPipelineRunning(false); setPipelineMsg(''); });
        }, 1500);
      })
      .catch(() => { setPipelineRunning(false); setPipelineMsg('Failed. Check APIFY_TOKEN in Vault.'); });
  }

  const signals = data?.signals ?? [];
  const kpis = data?.kpis ?? [];
  const competitors = data?.competitors ?? [];
  const hasData = competitors.length > 0;
  const isEmpty = !loading && !hasData;

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <main className="min-h-screen pb-24">
        <CompetitorSubNav />
        <div className="px-6 max-w-[1200px] 2xl:max-w-[min(92vw,1700px)] mx-auto mt-[18px]">
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <span className="material-symbols-outlined text-[48px]" style={{ color: 'rgba(0,0,0,0.12)' }}>radar</span>
            <h2 className="text-[22px] font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>No Competitors Tracked</h2>
            <p className="text-[14px] max-w-md" style={{ color: 'rgba(0,0,0,0.4)', lineHeight: 1.6 }}>
              Run the competitor discovery pipeline to find and track competitors. Data is scraped from Instagram, TikTok, LinkedIn, and YouTube via Apify.
            </p>
            {pipelineMsg && (
              <p className="text-[13px] font-medium" style={{ color: ACCENT }}>{pipelineMsg}</p>
            )}
            <button
              onClick={handleDiscover}
              disabled={pipelineRunning}
              className="bg-[#0066cc] text-white px-6 py-3 rounded-full text-[13px] font-semibold active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${pipelineRunning ? 'animate-spin' : ''}`}>
                {pipelineRunning ? 'progress_activity' : 'travel_explore'}
              </span>
              {pipelineRunning ? 'Running Pipeline...' : 'Discover Competitors'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Data state ──────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen pb-24">
      <CompetitorSubNav />

      <div className="px-6 max-w-[1200px] 2xl:max-w-[min(92vw,1700px)] mx-auto mt-[18px] space-y-8">

        {/* ── 1. Signal Strip ─────────────────────────────────── */}
        {signals.length > 0 && (
          <section style={{ ...G3, overflow: 'hidden' }}>
            {signals.map((s, idx) => {
              const dotCls    = s.severity === 'red' ? 'bg-red-400'     : s.severity === 'green' ? 'bg-emerald-400' : 'bg-amber-400';
              const textCls   = s.severity === 'red' ? 'text-red-400'   : s.severity === 'green' ? 'text-emerald-400' : 'text-amber-400';
              const borderCls = s.severity === 'red' ? 'border-red-400/20 bg-red-400/5' : s.severity === 'green' ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-amber-400/20 bg-amber-400/5';
              return (
                <div key={s.id} className="flex items-center justify-between px-6 py-4 gap-6"
                  style={{ borderTop: idx > 0 ? '1px solid rgba(241,245,251,0.07)' : 'none' }}>
                  <div className="flex items-center gap-4">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotCls}`} />
                    <p style={{ fontSize: 13, lineHeight: 1.55, color: I3c, margin: 0 }}>{s.text}</p>
                  </div>
                  <button className={`flex-shrink-0 border rounded-full px-4 py-1.5 transition-all hover:opacity-80 active:scale-95 ${textCls} ${borderCls}`}
                    style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {s.cta}
                  </button>
                </div>
              );
            })}
          </section>
        )}

        {/* ── Refresh bar (always visible when data exists) ────────── */}
        <div className="flex items-center justify-between">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: INK_4, margin: 0 }}>Market Intelligence</p>
          <div className="flex items-center gap-3">
            {pipelineMsg && <p className="text-[12px]" style={{ color: ACCENT }}>{pipelineMsg}</p>}
            <button
              onClick={handleDiscover}
              disabled={pipelineRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 disabled:opacity-40"
              style={{ background: 'rgba(0,102,204,0.1)', color: ACCENT, border: '1px solid rgba(0,102,204,0.2)' }}
            >
              <span className={`material-symbols-outlined text-[13px] ${pipelineRunning ? 'animate-spin' : ''}`}>refresh</span>
              {pipelineRunning ? 'Refreshing...' : 'Discover More'}
            </button>
          </div>
        </div>

        {/* ── 2. Market Intelligence KPIs ────────────────────────── */}
        {kpis.length > 0 && (
          <section>
            <div className="grid grid-cols-4 gap-4">
              {kpis.map(k => (
                <div key={k.label} style={{ ...G4, padding: 24 }}>
                  <div className="flex items-center justify-between mb-3">
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: I4d, margin: 0 }}>{k.label}</p>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: I4d }}>{k.icon}</span>
                  </div>
                  <p style={{ fontFamily: 'ui-monospace, "Geist Mono", monospace', fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', color: I4, margin: '0 0 8px', lineHeight: 1 }}>
                    {k.value}<span style={{ fontSize: 16, fontWeight: 500, color: I4d }}>{k.unit}</span>
                  </p>
                  <div className={`flex items-center gap-1 text-[11px] font-bold ${k.up === true ? 'text-emerald-600' : k.up === false ? 'text-rose-500' : ''}`}
                    style={k.up === null ? { color: I4d } : {}}>
                    <span className="material-symbols-outlined text-[13px]">
                      {k.up === true ? 'trending_up' : k.up === false ? 'trending_down' : 'horizontal_rule'}
                    </span>
                    {k.delta}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 3. Competitor Matrix + Market Positioning ──────────────────────── */}
        <section className="grid grid-cols-12 gap-6">

          {/* Competitor Matrix */}
          <div className="col-span-7" style={{ ...G1, overflow: 'hidden' }}>
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: I1d, margin: '0 0 4px' }}>Intelligence</p>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: I1, letterSpacing: '-0.02em', margin: 0 }}>Top Competitors</h2>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderTop: `1px solid ${L1}` }}>
                  {['Brand', 'Share of Voice', 'Sentiment', 'Momentum'].map((h, i) => (
                    <th key={h} className={`px-5 py-3${i === 3 ? ' text-right' : ''}`}
                      style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: I1d }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitors.map(c => {
                  const sentColor = c.sentUp === true ? '#059669' : c.sentUp === false ? '#f87171' : I1c;
                  const momColor  = c.sentUp === true ? '#059669' : c.sentUp === false ? '#f87171' : I1d;
                  return (
                    <tr key={c.name} style={{ borderTop: `1px solid ${L1}` }} className="hover:bg-black/[0.03] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{
                              background: c.dashed ? 'transparent' : c.accent ? ACCENT : L1,
                              border: c.dashed ? `1.5px dashed ${I1d}` : 'none',
                              color: c.accent ? '#fff' : I1,
                            }}>
                            {c.initial}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: c.dashed ? 500 : 600, color: c.dashed ? I1d : I1 }}>
                            {c.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4"
                        style={{ fontFamily: 'ui-monospace, "Geist Mono", monospace', fontSize: 13, color: I1c }}>
                        {c.sov}
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: 12, fontWeight: 700, color: sentColor }}>
                        {c.sentiment}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: momColor }}>
                          {c.momentum}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Market Positioning Bubble Chart */}
          <div className="col-span-5 flex flex-col" style={{ ...G2, padding: 24 }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: I2d, margin: '0 0 4px' }}>Positioning</p>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: I2, letterSpacing: '-0.02em', margin: 0 }}>Market Map</h2>
              </div>
            </div>

            <div className="relative flex-grow rounded-xl overflow-hidden"
              style={{
                minHeight: 260,
                background: 'rgba(0,0,0,0.15)',
                border: '1px solid rgba(255,255,255,0.10)',
                backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)',
                backgroundSize: '40px 40px',
              }}>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest" style={{ color: I2d }}>
                Brand Reach →
              </span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] uppercase tracking-widest" style={{ color: I2d, transformOrigin: 'left center' }}>
                Engagement →
              </span>

              {competitors.map((c, i) => {
                const positions = [
                  { top: '18%', left: '62%', w: 'w-16', h: 'h-16', size: 'text-xs' },
                  { top: '8%',  left: '38%', w: 'w-20', h: 'h-20', size: 'text-sm' },
                  { top: '42%', left: '58%', w: 'w-12', h: 'h-12', size: 'text-[10px]' },
                  { top: '55%', left: '22%', w: 'w-14', h: 'h-14', size: 'text-[10px]' },
                  { top: '28%', left: '18%', w: 'w-12', h: 'h-12', size: 'text-[10px]' },
                ];
                const pos = positions[i] ?? positions[positions.length - 1];
                const bubbleStyle = c.accent
                  ? { background: ACCENT, border: '1px solid rgba(255,255,255,0.30)', color: '#fff', boxShadow: '0 4px 24px rgba(0,102,204,0.45)' }
                  : c.dashed
                    ? { background: 'transparent', border: '1.5px dashed rgba(244,248,255,0.40)', color: I2d }
                    : { background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', color: I2d };

                return (
                  <div key={c.name}
                    className={`absolute ${pos.w} ${pos.h} rounded-full flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition-transform ${pos.size}`}
                    style={{
                      top: pos.top, left: pos.left,
                      backdropFilter: 'blur(8px)',
                      ...bubbleStyle,
                    }}>
                    {c.initial}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t flex items-center justify-between py-6" style={{ borderColor: L1 }}>
          <p style={{ fontSize: 11, color: INK_4 }}>© 2026 YVON Intelligence. Built for Excellence.</p>
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Support'].map(l => (
              <a key={l} href="#" style={{ fontSize: 11, color: INK_4 }} className="hover:opacity-70 transition-opacity">{l}</a>
            ))}
          </div>
        </footer>

      </div>
    </main>
  );
}
