'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Overview',    href: '/screens/analytics' },
  { label: 'Portfolio',   href: '/screens/analytics/portfolio' },
  { label: 'Social Media', href: '/screens/analytics/social-media' },
  { label: 'Content',     href: '/screens/analytics/content' },
];

/* ─── SVG Polyline Chart ─── */
function PolyChart({ series, weeks = ['W1','W2','W3','W4','W5','W6'], height = 'h-48' }: {
  series: { color: string; points: string }[];
  weeks?: string[];
  height?: string;
}) {
  return (
    <div className={`${height} w-full relative`}>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />
      <div className="absolute bottom-0 left-0 w-[1px] h-full bg-white/10" />
      <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
        {series.map((s, i) => (
          <polyline key={i} fill="none" points={s.points} stroke={s.color} strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between w-full text-[10px] text-[#c1c6d6] mt-2 absolute -bottom-6 px-1">
        {weeks.map((w) => <span key={w}>{w}</span>)}
      </div>
    </div>
  );
}

/* ─── Platform badge ─── */
function PlatformBadge({ platform }: { platform: string }) {
  if (platform === 'TT') return <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded border border-white/10 w-8 text-center inline-block">TT</span>;
  if (platform === 'IG') return <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded border border-white/10 w-8 text-center inline-block flex justify-center items-center" style={{ background: 'linear-gradient(135deg,#f09433,#e6683c,#bc1888)' }}><span className="material-symbols-outlined text-[12px]">photo_camera</span></span>;
  if (platform === 'LI') return <span className="text-[10px] font-bold bg-[#0a66c2] text-white px-2 py-0.5 rounded border border-white/10 w-8 text-center inline-block">LI</span>;
  if (platform === 'YT') return <span className="text-[10px] font-bold bg-[#ff0000] text-white px-2 py-0.5 rounded border border-white/10 w-8 text-center inline-block">YT</span>;
  return null;
}

export default function AnalyticsContentPage() {
  const pathname = usePathname();

  return (
    <main className="flex-grow pt-20 pb-16 px-6 max-w-[980px] mx-auto w-full space-y-16">

      {/* ── Sub-Nav Tabs ── */}
      <div className="flex items-center gap-1 pt-6 border-b border-white/10 pb-0">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href}
              className={`px-5 py-3 text-[13px] font-semibold transition-all relative ${isActive ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>
              {tab.label}
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0071e3] rounded-full" />}
            </Link>
          );
        })}
      </div>

      {/* ── 1. Hero Briefing ── */}
      <section className="space-y-6">
        <h1 className="text-[56px] leading-[1.07] font-semibold tracking-tight text-white" style={{ fontFamily: 'Inter', letterSpacing: '-0.017em' }}>
          Platform Intelligence. <br />
          <span className="text-[#c1c6d6]">Your content ecosystem at a glance.</span>
        </h1>
        <div className="bg-[#2a2a2a] rounded-xl p-8 border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0071e3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-lg">
              <h2 className="text-2xl font-semibold text-white">Daily Synthesis</h2>
              <p className="text-[17px] leading-[1.47] text-[#c1c6d6]">
                Short-form video engagement on TikTok is up 18% week-over-week, driving a lower CAC. YouTube long-form content retention has stabilized, but revenue share requires optimization. Consider prioritizing &apos;behind-the-scenes&apos; formats for the upcoming week based on current momentum.
              </p>
              <button className="bg-[#0071e3] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-colors inline-flex items-center gap-2 mt-2 active:scale-95">
                <span className="material-symbols-outlined text-[18px]">magic_button</span>
                Generate Action Plan
              </button>
            </div>
            <div className="flex flex-col gap-4 min-w-[200px]">
              <div className="bg-[#131313] p-4 rounded-lg border border-white/5">
                <p className="text-[12px] text-[#c1c6d6] uppercase tracking-wider mb-1 font-medium">Global Pulse Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-semibold text-white">87</span>
                  <span className="text-sm text-[#34c759] flex items-center mb-1">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +3.2
                  </span>
                </div>
              </div>
              <div className="bg-[#131313] p-4 rounded-lg border border-white/5">
                <p className="text-[12px] text-[#c1c6d6] uppercase tracking-wider mb-1 font-medium">Est. Revenue Impact</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-semibold text-white">$42.5k</span>
                  <span className="text-sm text-[#c1c6d6] mb-0.5">/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Platform Pulse ── */}
      <section className="space-y-6">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-[28px] font-medium leading-[1.14] tracking-tight text-white">Platform Pulse</h2>
          <a href="#" className="text-[14px] text-[#0071e3] hover:underline flex items-center gap-1">
            View Full Analytics <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* TikTok */}
          <div className="bg-[#2a2a2a] rounded-xl p-5 border border-white/5 hover:bg-[#353535] transition-colors cursor-pointer flex flex-col justify-between h-[160px]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-white/10">
                  <span className="font-bold text-[10px] text-white">TT</span>
                </div>
                <span className="font-medium text-white text-[15px]">TikTok</span>
              </div>
              <span className="text-3xl font-semibold text-white tracking-tighter">94</span>
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#c1c6d6] uppercase tracking-wider">CAC</span>
                <span className="text-[13px] font-medium text-white">$1.20 <span className="text-[#34c759] text-[10px] ml-1">↓8%</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#c1c6d6] uppercase tracking-wider">Trend</span>
                <span className="text-[13px] font-medium text-[#34c759] flex items-center">
                  <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> Strong
                </span>
              </div>
            </div>
          </div>
          {/* YouTube */}
          <div className="bg-[#2a2a2a] rounded-xl p-5 border border-white/5 hover:bg-[#353535] transition-colors cursor-pointer flex flex-col justify-between h-[160px]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ff0000] flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </div>
                <span className="font-medium text-white text-[15px]">YouTube</span>
              </div>
              <span className="text-3xl font-semibold text-white tracking-tighter">82</span>
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#c1c6d6] uppercase tracking-wider">CAC</span>
                <span className="text-[13px] font-medium text-white">$3.45 <span className="text-[#ff3b30] text-[10px] ml-1">↑2%</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#c1c6d6] uppercase tracking-wider">Trend</span>
                <span className="text-[13px] font-medium text-[#c1c6d6] flex items-center">
                  <span className="material-symbols-outlined text-[12px] mr-0.5">trending_flat</span> Stable
                </span>
              </div>
            </div>
          </div>
          {/* Instagram */}
          <div className="bg-[#2a2a2a] rounded-xl p-5 border border-white/5 hover:bg-[#353535] transition-colors cursor-pointer flex flex-col justify-between h-[160px]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10" style={{ background: 'linear-gradient(135deg,#f09433,#e6683c,#bc1888)' }}>
                  <span className="material-symbols-outlined text-[14px] text-white">photo_camera</span>
                </div>
                <span className="font-medium text-white text-[15px]">Instagram</span>
              </div>
              <span className="text-3xl font-semibold text-white tracking-tighter">76</span>
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#c1c6d6] uppercase tracking-wider">CAC</span>
                <span className="text-[13px] font-medium text-white">$2.80 <span className="text-[#34c759] text-[10px] ml-1">↓4%</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#c1c6d6] uppercase tracking-wider">Trend</span>
                <span className="text-[13px] font-medium text-[#34c759] flex items-center">
                  <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> Growth
                </span>
              </div>
            </div>
          </div>
          {/* LinkedIn */}
          <div className="bg-[#2a2a2a] rounded-xl p-5 border border-white/5 hover:bg-[#353535] transition-colors cursor-pointer flex flex-col justify-between h-[160px]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0a66c2] flex items-center justify-center border border-white/10">
                  <span className="font-bold text-[12px] text-white">in</span>
                </div>
                <span className="font-medium text-white text-[15px]">LinkedIn</span>
              </div>
              <span className="text-3xl font-semibold text-white tracking-tighter">68</span>
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#c1c6d6] uppercase tracking-wider">CAC</span>
                <span className="text-[13px] font-medium text-white">$8.50 <span className="text-[#ff3b30] text-[10px] ml-1">↑12%</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#c1c6d6] uppercase tracking-wider">Trend</span>
                <span className="text-[13px] font-medium text-[#ff3b30] flex items-center">
                  <span className="material-symbols-outlined text-[12px] mr-0.5">trending_down</span> Decline
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. What to Create Next (light panel) ── */}
      <section className="bg-[#f4f5f7] rounded-[32px] p-8 md:p-10 text-gray-900 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-[28px] font-semibold leading-[1.14] tracking-tight text-gray-900 mb-2">What to Create Next</h2>
            <p className="text-[14px] text-gray-500">AI-driven recommendations based on current platform deficits and audience intent.</p>
          </div>
          <button className="bg-[#0071e3] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-colors active:scale-95">
            Generate Briefs
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              </div>
              <span className="text-sm font-medium text-gray-700">High Priority</span>
            </div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Educational Reels: UX Trends</h3>
            <p className="text-[13px] leading-relaxed text-gray-500">Audience search volume for &quot;UX patterns 2024&quot; is up 45% on Instagram. Competitor volume is low.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>article</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Medium Priority</span>
            </div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Long-form: API Integration Guide</h3>
            <p className="text-[13px] leading-relaxed text-gray-500">High retention potential on YouTube. Addresses common support queries reducing ticket volume.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>podcasts</span>
              </div>
              <span className="text-sm font-medium text-gray-500">Low Priority</span>
            </div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Audio: Founder Interview</h3>
            <p className="text-[13px] leading-relaxed text-gray-500">Brand building exercise. Good for Spotify distribution but low direct acquisition metrics.</p>
          </div>
        </div>
      </section>

      {/* ── 4. Platform Analysis ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Platform Priority */}
        <div className="space-y-4">
          <h2 className="text-[17px] font-medium text-white mb-4">Platform Priority</h2>
          <div className="bg-[#2a2a2a] rounded-xl p-5 border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-medium text-white">TikTok</span>
              <span className="px-3 py-1 rounded-full border border-[#00c896]/30 text-[#00c896] text-[11px] font-medium">Primary</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-medium text-white">Instagram</span>
              <span className="px-3 py-1 rounded-full border border-white/10 text-[#c1c6d6] text-[11px] font-medium">Core</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-medium text-white">LinkedIn</span>
              <span className="px-3 py-1 rounded-full border border-white/10 text-[#c1c6d6] text-[11px] font-medium">Nurture</span>
            </div>
            <div className="flex justify-between items-center opacity-40">
              <span className="text-[15px] font-medium text-white">Twitter</span>
              <span className="px-3 py-1 rounded-full border border-white/10 text-[#c1c6d6] text-[11px] font-medium bg-white/5">De-prioritize</span>
            </div>
          </div>
        </div>
        {/* Format Conversion */}
        <div className="space-y-4">
          <h2 className="text-[17px] font-medium text-white mb-4">Format Conversion</h2>
          <div className="bg-[#2a2a2a] rounded-xl p-5 border border-white/5 flex flex-col gap-5">
            <div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-[#c1c6d6]">Short-form Video (TikTok)</span>
                <span className="text-[#00c896] font-medium">7.9%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5">
                <div className="bg-[#00c896] h-1.5 rounded-full" style={{ width: '79%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-[#c1c6d6]">Carousels (IG)</span>
                <span className="text-white font-medium">6.4%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5">
                <div className="bg-white/20 h-1.5 rounded-full" style={{ width: '64%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-[#c1c6d6]">Text Posts (LI)</span>
                <span className="text-white font-medium">4.1%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5">
                <div className="bg-white/20 h-1.5 rounded-full" style={{ width: '41%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Top Posts This Month ── */}
      <section className="mt-16 space-y-6">
        <h2 className="text-[28px] font-medium leading-[1.14] tracking-tight text-white mb-8 border-b border-white/10 pb-4">
          Top Posts This Month
        </h2>
        <div className="flex flex-col gap-6">
          {[
            { n: '01', title: '5 Secrets to Better UI Design',  meta: 'TikTok · Apr 2',     views: '142k views', green: true },
            { n: '02', title: 'My Desk Setup Tour',             meta: 'Instagram · Apr 4',  views: '89k views',  green: false },
            { n: '03', title: 'Why I switched to Figma',        meta: 'LinkedIn · Mar 28',  views: '45k views',  green: false },
          ].map((p) => (
            <div key={p.n} className="flex items-center justify-between group cursor-pointer border-b border-white/5 pb-6">
              <div className="flex items-center gap-6">
                <span className="text-2xl font-light text-[#c1c6d6]/50 w-8">{p.n}</span>
                <div>
                  <h3 className="text-[17px] font-medium text-white mb-1 group-hover:text-[#0071e3] transition-colors">{p.title}</h3>
                  <p className="text-[13px] text-[#c1c6d6]">{p.meta}</p>
                </div>
              </div>
              <span className={`text-[15px] font-semibold ${p.green ? 'text-[#00c896]' : 'text-white'}`}>{p.views}</span>
            </div>
          ))}
        </div>
        <div className="pt-8 text-center">
          <span className="text-[11px] uppercase tracking-widest text-[#c1c6d6]/60 font-medium mb-2 block">Next Section</span>
          <button className="text-white hover:text-white/80 transition-colors inline-flex items-center gap-1 text-[15px] font-medium">
            Revenue Attribution · CAC Per Channel <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
        </div>
      </section>

      {/* ── 6. Revenue Attribution · CAC Per Channel ── */}
      <section className="mt-24 space-y-8">
        <div>
          <h2 className="text-[28px] font-medium leading-[1.14] tracking-tight text-white mb-1">Revenue Attribution · CAC Per Channel</h2>
          <p className="text-[14px] text-[#c1c6d6]">estimated cost per acquisition by platform</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'TikTok',    value: '$4.20',  sub: 'Best CAC',         subColor: 'text-[#34c759]', trend: '+18% MoM' },
            { label: 'Instagram', value: '$7.80',  sub: '',                 subColor: 'text-[#ff3b30]', trend: '+6% MoM'  },
            { label: 'YouTube',   value: '$12.40', sub: '',                 subColor: 'text-[#ff3b30]', trend: '+31% MoM' },
            { label: 'LinkedIn',  value: '$18.60', sub: 'Highest · review spend', subColor: 'text-[#ff3b30]', trend: '' },
          ].map((ch) => (
            <div key={ch.label} className="bg-[#2a2a2a] rounded-xl p-4 border border-white/5 flex flex-col justify-between h-[100px]">
              <span className="font-medium text-white text-[13px]">{ch.label}</span>
              <div>
                <div className="text-xl font-semibold text-white">{ch.value}</div>
                <div className="text-[11px] text-[#c1c6d6]">
                  {ch.sub && <span>{ch.sub} · </span>}
                  <span className={ch.subColor}>{ch.trend}</span>
                </div>
              </div>
            </div>
          ))}
          {/* Avg LTV */}
          <div className="bg-[#0071e3]/10 rounded-xl p-4 border border-[#0071e3]/30 flex flex-col justify-between h-[100px]">
            <span className="font-medium text-[#0071e3] text-[13px]">Avg LTV</span>
            <div>
              <div className="text-xl font-semibold text-white">$142</div>
              <div className="text-[11px] text-[#c1c6d6]">LTV:CAC ratio · <span className="text-[#34c759]">18×</span></div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5">
            <h3 className="text-[15px] font-medium text-white mb-1">Revenue by Channel</h3>
            <p className="text-[12px] text-[#c1c6d6] mb-6">social-attributed revenue · 6-week trend by platform</p>
            <PolyChart series={[
              { color: '#00c896', points: '0,180 80,150 160,160 240,110 320,80 400,40' },
              { color: '#bc1888', points: '0,150 80,140 160,130 240,120 320,110 400,100' },
              { color: '#ff0000', points: '0,100 80,110 160,105 240,95 320,90 400,85' },
              { color: '#0a66c2', points: '0,60 80,70 160,80 240,85 320,100 400,120' },
            ]} />
          </div>
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5">
            <h3 className="text-[15px] font-medium text-white mb-1">Cross-Platform Follower Growth</h3>
            <p className="text-[12px] text-[#c1c6d6] mb-6">all platforms · 6-week trend</p>
            <PolyChart height="h-40" series={[
              { color: '#00c896', points: '0,190 80,180 160,150 240,100 320,50 400,10' },
              { color: '#bc1888', points: '0,160 80,155 160,140 240,130 320,120 400,110' },
              { color: '#ff0000', points: '0,140 80,135 160,130 240,125 320,120 400,115' },
              { color: '#0a66c2', points: '0,120 80,115 160,110 240,115 320,120 400,125' },
            ]} />
            <div className="flex flex-wrap gap-4 text-[11px] text-[#c1c6d6] mt-8">
              {[{c:'#bc1888',l:'Instagram'},{c:'#0a66c2',l:'LinkedIn'},{c:'#ff0000',l:'YouTube'},{c:'#00c896',l:'TikTok'}].map((x) => (
                <div key={x.l} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: x.c }} /> {x.l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligence Synthesis */}
        <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5 mt-8">
          <div className="mb-4">
            <h3 className="text-[15px] font-medium text-white mb-1">INTELLIGENCE SYNTHESIS</h3>
            <p className="text-[12px] text-[#c1c6d6]">Kai · Nate · proactive interpretation</p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 items-start bg-[#131313]/50 p-4 rounded-lg border border-white/5">
              <div className="w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-[14px] font-semibold flex-shrink-0">K</div>
              <div>
                <span className="text-[12px] font-medium text-[#0071e3] mb-1 block">Kai</span>
                <p className="text-[14px] text-[#e2e2e2] leading-relaxed">&quot;TikTok follower growth accelerated 148% this week driven by 3 repurposed Instagram Reels posted Mar 18–20. Algorithm window is open. Recommend doubling repurposing cadence to 6 clips/week.&quot;</p>
              </div>
            </div>
            <div className="flex gap-4 items-start bg-[#131313]/50 p-4 rounded-lg border border-white/5">
              <div className="w-8 h-8 rounded-full bg-[#bc1888] text-white flex items-center justify-center text-[14px] font-semibold flex-shrink-0">N</div>
              <div>
                <span className="text-[12px] font-medium text-[#bc1888] mb-1 block">Nate</span>
                <p className="text-[14px] text-[#e2e2e2] leading-relaxed">&quot;TikTok now drives 41% of attributed conversions at lowest CAC ($4.20). LinkedIn converts at 3× cost with lower volume. Reallocate 20% of LinkedIn content budget to TikTok production this month.&quot;</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 text-center">
          <span className="text-[11px] uppercase tracking-widest text-[#c1c6d6]/60 font-medium mb-2 block">Next Section</span>
          <button className="text-white hover:text-white/80 transition-colors inline-flex items-center gap-1 text-[15px] font-medium">
            Content Operations <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
        </div>
      </section>

      {/* ── 7. Content Operations ── */}
      <section className="mt-24 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Past — Posted Content */}
            <div>
              <h2 className="text-[20px] font-medium leading-[1.14] tracking-tight text-white mb-1">PAST — POSTED CONTENT</h2>
              <p className="text-[12px] text-[#c1c6d6] mb-4">Verified from social media · auto-populated</p>
              <div className="bg-[#2a2a2a] rounded-xl p-5 border border-white/5">
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[#c1c6d6] mb-2">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[
                    null, { tag: 'Post · LI', color: 'bg-[#0a66c2]/20' }, null,
                    { tag: 'Carousel · IG', color: 'bg-[#bc1888]/20' }, null,
                    { tag: 'Short · YT', color: 'bg-[#ff0000]/20' }, null,
                    null, { tag: 'Post · YT', color: 'bg-[#ff0000]/20' }, null,
                    { tag: 'Article · LI', color: 'bg-[#0a66c2]/20' }, null, null, null,
                    null, null, null, null, null, null, null,
                  ].map((cell, i) => (
                    <div key={i} className="aspect-square bg-[#131313]/50 rounded flex flex-col items-center justify-center border border-white/5 p-1 gap-1">
                      {cell && <span className={`text-[9px] text-white ${cell.color} px-1 py-0.5 rounded w-full text-center truncate`}>{cell.tag}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming — Content Plan */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-[20px] font-medium leading-[1.14] tracking-tight text-white mb-1">UPCOMING — CONTENT PLAN</h2>
                  <p className="text-[12px] text-[#c1c6d6]">Click any empty day to add entries from Creative Studio land here</p>
                </div>
                <button className="bg-[#34c759] text-white px-3 py-1.5 rounded text-[12px] font-medium hover:opacity-90 transition-colors active:scale-95">Verify Now</button>
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] text-[#c1c6d6] mb-4">
                {[{c:'#00c896',l:'IG Reel / TT Short'},{c:'#bc1888',l:'Carousel'},{c:'#0a66c2',l:'LinkedIn'},{c:'#8b919f',l:'Static'}].map((x) => (
                  <div key={x.l} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: x.c }} />{x.l}</div>
                ))}
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20 border border-white/50" />Planned</div>
              </div>
              <div className="space-y-3">
                {[
                  { date: '2026-03-29', platform: 'TT', title: 'Comment response — top 3 questions' },
                  { date: '2026-04-01', platform: 'IG', title: 'Spring colour palette breakdown' },
                  { date: '2026-04-03', platform: 'LI', title: 'Building a brand, not a product line' },
                ].map((row) => (
                  <div key={row.date} className="bg-[#2a2a2a] rounded-lg p-4 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] text-white font-medium w-[80px]">{row.date}</span>
                      <PlatformBadge platform={row.platform} />
                      <span className="text-[13px] text-[#c1c6d6]">{row.title}</span>
                    </div>
                    <span className="text-[10px] font-medium text-[#ffb4ab] bg-[#ffb4ab]/10 px-2 py-1 rounded">NOT POSTED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            {/* Missed — Needs Attention */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-[20px] font-medium leading-[1.14] tracking-tight text-[#ffb4ab] mb-1">MISSED — NEEDS ATTENTION</h2>
                  <p className="text-[12px] text-[#c1c6d6]">Post-level planned content with no social media match</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#c1c6d6] mb-1">Last verified: Apr 4, 2:30 PM</p>
                  <button className="bg-[#34c759] text-white px-3 py-1.5 rounded text-[12px] font-medium hover:opacity-90 transition-colors active:scale-95">Verify Now</button>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { date: '2026-03-29', platform: 'TT', title: 'Comment response — top 3 questions' },
                  { date: '2026-04-01', platform: 'IG', title: 'Spring colour palette breakdown' },
                  { date: '2026-04-03', platform: 'LI', title: 'Building a brand, not a product line' },
                  { date: 'yyyy-mm-dd', platform: 'LI', title: 'Article' },
                ].map((card, i) => (
                  <div key={i} className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ffb4ab]/20 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className={`text-[13px] font-medium ${card.date === 'yyyy-mm-dd' ? 'text-[#c1c6d6]' : 'text-white'}`}>{card.date}</span>
                        <PlatformBadge platform={card.platform} />
                      </div>
                      <span className="text-[10px] font-medium text-[#ffb4ab] bg-[#ffb4ab]/10 px-2 py-1 rounded">NOT POSTED</span>
                    </div>
                    <div className="text-[14px] text-white">{card.title}</div>
                    <div className="flex justify-end gap-3 mt-1 border-t border-white/5 pt-3">
                      <button className="text-[11px] text-[#c1c6d6] hover:text-white transition-colors">Explain</button>
                      <button className="text-[11px] text-[#c1c6d6] hover:text-white transition-colors">Skip</button>
                      <button className="text-[11px] text-[#ffb4ab] hover:text-[#ffb4ab]/80 transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Content Mix */}
            <div>
              <h2 className="text-[20px] font-medium leading-[1.14] tracking-tight text-white mb-1">RECOMMENDED CONTENT MIX</h2>
              <p className="text-[12px] text-[#c1c6d6] mb-4">Kai · based on engagement + revenue data</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { pct: '40%', color: 'text-[#00c896]', label: 'Reels / Shorts',   sub: 'Highest engagement ROI' },
                  { pct: '25%', color: 'text-white',     label: 'Long-form Video',  sub: 'Watch time + depth'     },
                  { pct: '20%', color: 'text-white',     label: 'Carousel',         sub: 'Saves + authority'      },
                  { pct: '15%', color: 'text-white',     label: 'Static / Text',    sub: 'Brand consistency'      },
                ].map((m) => (
                  <div key={m.label} className="bg-[#2a2a2a] rounded-lg p-4 border border-white/5">
                    <div className={`text-2xl font-semibold ${m.color} mb-1`}>{m.pct}</div>
                    <div className="text-[13px] font-medium text-white">{m.label}</div>
                    <div className="text-[11px] text-[#c1c6d6] mt-1">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Operator Recommendation Strip ── */}
      <section className="mt-16 w-full bg-[#0071e3]/5 border border-[#0071e3]/20 rounded-xl p-6">
        <h2 className="text-[15px] font-medium text-[#0071e3] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
          Weekly Operator Recommendation
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[13px] text-[#c1c6d6]">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 flex-shrink-0" />
            <span>Increase short-form output immediately while TikTok CAC remains lowest</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 flex-shrink-0" />
            <span>Maintain one weekly founder-led LinkedIn post for authority</span>
          </li>
        </ul>
      </section>
    </main>
  );
}
