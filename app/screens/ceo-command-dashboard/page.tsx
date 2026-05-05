'use client';

export default function CEOCommandDashboardPage() {
  return (
    <>
      {/* Anomalies Marquee Strip */}
      <header className="fixed top-14 w-full z-40 bg-[#1a1a1c] border-b border-white/5">
        <div className="flex items-center px-8 h-9 overflow-hidden">
          <div className="flex items-center gap-3 flex-shrink-0 mr-6">
            <span className="material-symbols-outlined text-green-400 text-sm">error</span>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-[0.2em]">Anomalies</span>
          </div>
          <div className="flex gap-12 animate-marquee whitespace-nowrap text-[11px] font-medium text-white/60">
            <p>Instagram engagement dropped <span className="text-red-400">18%</span> vs 7-day avg</p>
            <p className="text-white/20">|</p>
            <p>YouTube views up <span className="text-green-400">34%</span> — spike detected in lifestyle segment</p>
            <p className="text-white/20">|</p>
            <p>Direct traffic retention increased <span className="text-green-400">5.2%</span></p>
            <p className="text-white/20">|</p>
            <p>Instagram engagement dropped <span className="text-red-400">18%</span> vs 7-day avg</p>
          </div>
        </div>
      </header>

      <main className="pt-32 px-8 max-w-screen-2xl mx-auto pb-24">

        {/* Page Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-2">CEO Command</p>
            <h1
              className="text-5xl font-semibold text-white"
              style={{ letterSpacing: '-0.28px' }}
            >
              CEO Command Center
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-white/40 font-medium">Last updated 5 Apr 2026</p>
            <p className="text-[12px] text-green-400 font-bold uppercase tracking-wider">Next refresh 06:00 AM</p>
          </div>
        </div>

        {/* Primary Hero */}
        <section className="relative glass-card rounded-[18px] overflow-hidden mb-8 p-12 min-h-[420px] flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-1/2 h-full">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0e0e0e]/20 to-transparent z-10" />
            <div
              className="w-full h-full opacity-60 mix-blend-screen"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRQrl5WEnBicGB8i6oK-NBZX6xcNJq3H3puNqHwGvQFHTMlT6W2rXWlQgWzGCbfbizE_QyLK1aklHz-afhKt2yAf8jzNc-qiP5w-V5bbNsUPjzhJCMTN-VKCb1pgJVqFQBIO6L6v-14tBIa2Zf_3Q8HFKaSgxfkP8jj30wvxQVCt9Iad7NVP5KUx5o3GBwShow4H8cYvbjF5GulhjpNDijqE3l4WuxZNfpw-l6lWIpJX2N_gPtpPTbK7TQFrslmjhKhQ98wIz21oFt')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
          <div className="relative z-20 max-w-xl">
            <h2
              className="text-6xl font-semibold text-white mb-2"
              style={{ letterSpacing: '-0.28px' }}
            >
              Hi. Let&apos;s make today count.
            </h2>
            <p className="text-[17px] text-white/40 mb-10" style={{ lineHeight: '1.47' }}>
              CEO Command Center · 5 April 2026 · <span className="text-white/80">36 decisions waiting</span>
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Brand Health</span>
                <span className="text-sm font-semibold text-white">74/100</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Reach</span>
                <span className="text-sm font-semibold text-white">284K</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Content</span>
                <span className="text-sm font-semibold text-white">14 pcs</span>
              </div>
            </div>
            <button className="bg-[#0066cc] text-white px-8 py-[11px] rounded-full font-semibold text-[17px] transition-transform active:scale-95 flex items-center gap-3 hover:opacity-90">
              <span className="material-symbols-outlined text-xl">electric_bolt</span>
              Get Live Briefing
            </button>
          </div>
        </section>

        {/* Premium Briefing + Competitor Edge */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="md:col-span-8 glass-card p-10 rounded-[18px] flex gap-10">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-white/10 p-[1px]">
                <img
                  alt="Marcus"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ-YOk2UlylBfsT5VV4d8N8tdjmI9Sw4qrlV-5qpjPcFESRpEVkk21Xqrgq1WSiHE6_0DiF8H2B26lmH94Cc1tUtjH0gGmzCn5e0NVTPM9klLdk0TxrGiO7fMhthi73BjsJSdbg5-Tpxlk6h4Rs-BuzdoyJtwCV9HsvpH2ijltR9b75EGa93RYjRjQ1cSXmR-LV7AbZXgibXTSGn6ZaZKkoEwRnbZTbKDXY8n1oeV6csUswSDcsoNUTL42uaf7dhy3mQCBWb2JeWDh"
                  className="w-full h-full rounded-full object-cover grayscale opacity-80"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Premium Briefing</span>
                <span className="h-px w-8 bg-white/10" />
                <span className="text-[11px] font-bold text-white/80">Marcus · CEO Read</span>
              </div>
              <h3
                className="text-2xl font-semibold text-white mb-4"
                style={{ letterSpacing: '-0.374px', lineHeight: '1.24' }}
              >
                Hourbour is gaining traction through transparency-led storytelling, TikTok momentum is accelerating, and brand execution gaps remain around consistency.
              </h3>
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-full border border-green-500/20 uppercase tracking-widest">
                  Strategic Insight
                </div>
                <p className="text-[13px] text-white/30 italic underline decoration-white/10 cursor-pointer hover:text-white/50 transition-colors">
                  View full strategic analysis
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#0c1f3a] border border-[#1e3260]/40 p-10 rounded-[18px] relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066cc]/10 blur-[60px] rounded-full" />
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#0066cc] mb-6">Competitor Edge</h4>
            <p className="text-[17px] leading-relaxed text-[#d7e2ff] mb-8" style={{ lineHeight: '1.47' }}>
              Reformation&apos;s supply chain visibility is driving 12% higher intent scores among Gen Z.
            </p>
            <div className="flex items-center text-[11px] font-bold text-[#0066cc] gap-2 uppercase tracking-widest">
              Learn Opportunity <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </div>
        </section>

        {/* KPI Row */}
        <section className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12">
          <div className="glass-card p-6 rounded-[18px]">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] mb-3">KPI</p>
            <p className="text-2xl font-semibold text-white mb-1">3.78</p>
            <div className="flex items-center gap-1 text-[11px] text-red-400 font-bold">
              <span className="material-symbols-outlined text-[14px]">south_east</span>5.4%
            </div>
          </div>
          <div className="bg-green-400 p-6 rounded-[18px] transform hover:-translate-y-0.5 transition-transform">
            <p className="text-[10px] font-bold text-black/60 uppercase tracking-[0.1em] mb-3">Finished</p>
            <p className="text-2xl font-bold text-black mb-1">94%</p>
            <div className="flex items-center gap-1 text-[11px] text-black/80 font-bold">
              <span className="material-symbols-outlined text-[14px]">north_east</span>3.1%
            </div>
          </div>
          <div className="glass-card p-6 rounded-[18px]">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] mb-3">Brand Health</p>
            <p className="text-2xl font-semibold text-white mb-1">74</p>
            <div className="flex items-center gap-1 text-[11px] text-green-400 font-bold">
              <span className="material-symbols-outlined text-[14px]">add</span>2 pts
            </div>
          </div>
          <div className="glass-card p-6 rounded-[18px]">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] mb-3">Combined Reach</p>
            <p className="text-2xl font-semibold text-white mb-1">284K</p>
            <div className="flex items-center gap-1 text-[11px] text-green-400 font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>8% MoM
            </div>
          </div>
          <div className="glass-card p-6 rounded-[18px]">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] mb-3">Blended CAC</p>
            <p className="text-2xl font-semibold text-white mb-1">$8.20</p>
            <div className="flex items-center gap-1 text-[11px] text-green-400 font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>12% MoM
            </div>
          </div>
          <div className="glass-card p-6 rounded-[18px]">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] mb-3">Blended ROAS</p>
            <p className="text-2xl font-semibold text-white mb-1">3.8x</p>
            <div className="flex items-center gap-1 text-[11px] text-green-400 font-bold">
              <span className="material-symbols-outlined text-[14px]">add</span>0.4 MoM
            </div>
          </div>
        </section>

        {/* Signal Panels: Activity + Market Intel + Customer Voice */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Activity */}
          <div className="glass-card rounded-[18px] p-8">
            <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">Activity</h5>
            <ul className="space-y-6">
              {['Flagged Instagram anomaly', 'Delivered morning brief', 'Updated brand voice guidelines', 'Pushed size guide page'].map((item) => (
                <li key={item} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                  <p className="text-[15px] font-medium text-white/80">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Market Intelligence */}
          <div className="glass-card rounded-[18px] p-8 flex flex-col">
            <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">Market Intelligence</h5>
            <h6 className="text-[17px] font-semibold text-white mb-4" style={{ lineHeight: '1.47' }}>Reformation owns transparency.</h6>
            <p className="text-[15px] text-white/50 leading-relaxed mb-6">
              Reformation leads through founder-led analysis and supply chain visibility. Competitor momentum is peaking in lifestyle segments.
            </p>
            <div className="mt-auto bg-[#0066cc]/10 p-4 rounded-[11px] border border-[#0066cc]/20">
              <p className="text-[10px] font-bold text-[#0066cc] uppercase tracking-widest mb-1">Opportunity</p>
              <p className="text-[13px] font-medium text-white">Founder story + supply chain visibility</p>
            </div>
          </div>

          {/* Customer Voice */}
          <div className="glass-card rounded-[18px] p-8">
            <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">Customer Voice</h5>
            <div className="space-y-6">
              <div className="relative pl-6 border-l border-white/10">
                <p className="text-[15px] italic text-white/70">&quot;The quality of the new linen drop is incredible, truly transparent pricing.&quot;</p>
              </div>
              <div className="relative pl-6 border-l border-white/10">
                <p className="text-[15px] italic text-white/70">&quot;Loving the new TikTok content style, feels very real and approachable.&quot;</p>
              </div>
              <div className="bg-red-400/10 border border-red-400/20 p-4 rounded-[11px] flex items-center gap-3">
                <span className="material-symbols-outlined text-red-400 text-lg">warning</span>
                <p className="text-[12px] font-bold text-red-400 tracking-tight uppercase">Alert: Size guide missing in Instagram flow</p>
              </div>
            </div>
          </div>
        </section>

        {/* Decision Queue + Brand Pulse */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Decision Queue */}
          <div className="md:col-span-5 glass-card rounded-[18px] p-8">
            <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">Decision Queue</h5>
            <div className="space-y-6">
              <div className="p-4 rounded-[11px] bg-red-400/5 border border-red-400/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase text-red-400 tracking-widest">Act Now</span>
                  <span className="text-[10px] text-red-400/60 font-bold uppercase">Budget Due</span>
                </div>
                <p className="text-[15px] font-semibold text-white mb-6">Approve new Novizio Q3 budget?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 rounded-full border border-white/10 text-white/60 text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors active:scale-95">Decline</button>
                  <button className="py-2.5 rounded-full bg-red-400 text-black text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-95">Approve</button>
                </div>
              </div>
              <div className="p-4 rounded-[11px] bg-amber-400/5 border border-amber-400/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Today</span>
                  <span className="text-[10px] text-amber-400/60 font-bold uppercase">Operations</span>
                </div>
                <p className="text-[15px] font-semibold text-white mb-6">Sign off on Hourbour timeline?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 rounded-full border border-white/10 text-white/60 text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors active:scale-95">Review</button>
                  <button className="py-2.5 rounded-full bg-amber-400 text-black text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-95">Sign Off</button>
                </div>
              </div>
              <div className="p-4 rounded-[11px] bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">This Week</span>
                  <span className="text-[10px] text-white/20 font-bold uppercase">Strategy</span>
                </div>
                <p className="text-[15px] font-semibold text-white mb-6">Evaluate Reformation partnership?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 rounded-full border border-white/10 text-white/60 text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors active:scale-95">Analyze</button>
                  <button className="py-2.5 rounded-full border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors active:scale-95">Discuss</button>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Pulse Chart */}
          <div className="md:col-span-7 glass-card rounded-[18px] p-8 flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">Brand Pulse</h5>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0066cc]" />
                  <span className="text-[10px] font-bold text-white/60 uppercase">Novizio (74)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="text-[10px] font-bold text-white/60 uppercase">Hourbour (67)</span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-end justify-between px-2 pb-8 h-64 border-b border-white/5 mb-6 relative">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path className="opacity-80" d="M0 180 Q 100 120, 200 140 T 400 100 T 600 60 T 800 40" fill="none" stroke="#0066cc" strokeWidth="3" />
                <path d="M0 200 Q 100 180, 200 190 T 400 160 T 600 140 T 800 130" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              </svg>
              <div className="absolute -left-6 h-full flex flex-col justify-between text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase tracking-widest px-4">
              {['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8'].map((w) => <span key={w}>{w}</span>)}
            </div>
          </div>
        </section>

        {/* Workload Heatmap + Team */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Heatmap */}
          <div className="md:col-span-4 glass-card rounded-[18px] p-8">
            <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">Workload Intensity</h5>
            <div className="grid grid-cols-7 gap-1.5 mb-8">
              {[10,30,60,90,40,10,20,90,100,40,20,90,70,10,20,30,10,90,100,60,10].map((opacity, i) => (
                <div key={i} className="aspect-square rounded-[2px]" style={{ backgroundColor: `rgba(34,197,94,${opacity / 100})` }} />
              ))}
            </div>
            <div className="flex items-center justify-between text-[9px] font-bold text-white/30 uppercase tracking-widest">
              <span>Low</span>
              <div className="flex gap-1">
                {[10,40,70,100].map((o) => (
                  <div key={o} className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: `rgba(34,197,94,${o / 100})` }} />
                ))}
              </div>
              <span>Fully Occupied</span>
            </div>
          </div>

          {/* Team + Quick Access */}
          <div className="md:col-span-8 glass-card rounded-[18px] p-8 flex flex-col md:flex-row gap-12">
            <div className="flex-grow">
              <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">Team Working On</h5>
              <div className="space-y-6">
                {[
                  { name: 'Kai', role: 'Content Strategy', status: 'Active', active: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDavXSRLV5Wph1EQaPcw9VVfkDvahpbBcNqrNCGUUAuFCmhMF_TcA8aj4JKANHrMHKaWQQP6sVc1a0VVw-nt0meQf-2jcbzFZbbWF-CvnCpRVwfP8UsjJbY_YQc1kwwKm00P-TJMALHNEWkKvAd-HlUMUuJw_7j2xXYSURp2pKXhNXL5qYH2VDyzns8Ccs2crPXEn79QvVhCJ19km9ZRndLNfwSWU4W5pc97i3OXy7tlQzQ96TLVjI-S8nUn4AuXXCmFKYnWUMwVP5a' },
                  { name: 'Sofia', role: 'Brand Intelligence', status: 'Active', active: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJiqWjhWs4H86uul1A1QCCIfP7FeGSdbKJFMWMn7ytb6d2Rricye1lhLjR-ApS4PZjuy2_m3Ieb5JAZDCo20jkrkt_bZuRmQtwYCIB-WSTsjPAveGe-CBP-UWvQXvg8uMzTaz2Lapvh25b1Tn4OIMtQ1rNz6nsTM59w49p561JkD8CeVbzJ32D8aPMnCv8PYdo719OIMwteZcw1fs6Td30AUb1gMh8AV6DQ-Q9KUqtsLmHUyHTkyV26skLXNJ1DL1jzn7_cQdzciCC' },
                  { name: 'Nate', role: 'Tech Ops', status: 'Away', active: false, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6wU7YLX_qRglQW06YdoIFKAsQNjFnsQynYCuUdfcrDhtp8twbrqtA4L_MhUDIfj0K3uDO8JBd0_QutbT0LaGoUcJyLct5YbTkrQs08OOurNoebBwtX_qNB8j6n4KFw8H4WLwnOQI2p-ix8xDR-JW2CWyhesQotCvB6Cl7iOM-kEnpelJLFSOJS8DIAkTvDgJkM0IH3ROuYlZ1eU1RWf5hLIiGHGOOnnz0r6k60NQDllEPkw1ndQZwuQ5P2Wo1AqCigd1C_Zw7UlJ-' },
                ].map((member) => (
                  <div key={member.name} className={`flex items-center justify-between ${!member.active ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <img alt={member.name} src={member.img} className="w-8 h-8 rounded-full border border-white/10 object-cover grayscale" />
                      <div>
                        <p className="text-[15px] font-semibold text-white">{member.name}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-tighter">{member.role}</p>
                      </div>
                    </div>
                    {member.active ? (
                      <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20 uppercase tracking-widest">Active</span>
                    ) : (
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Away</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-px h-full bg-white/5 hidden md:block" />
            <div className="flex flex-col gap-3 min-w-[200px]">
              <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-5">Quick Access</h5>
              {['Full Analytics', 'Competitor Intel', 'Marketing Hub', 'Creative Studio'].map((label) => (
                <button key={label} className="flex items-center justify-between w-full p-4 rounded-[11px] bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all text-left active:scale-95">
                  <span className="text-[12px] font-bold text-white uppercase tracking-widest">{label}</span>
                  <span className="material-symbols-outlined text-sm text-white/40">arrow_forward_ios</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Executive Priorities */}
        <section className="mt-16 mb-16">
          <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">Executive Priorities</h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { badge: 'High Priority', badgeClass: 'text-[#0066cc] bg-[#0066cc]/10', owner: 'Diana', title: 'Close transparency gap', desc: "Address the 12% intent lead Reformation has in Gen Z via supply chain storytelling.", cta: 'Execute Plan' },
              { badge: 'Strategic', badgeClass: 'text-amber-400 bg-amber-400/10', owner: 'Marcus', title: 'Reallocate paid budget', desc: 'Move 15% of underperforming FB spend to TikTok creator seedings.', cta: 'Review Split' },
              { badge: 'Urgent', badgeClass: 'text-red-400 bg-red-400/10', owner: 'Nate', title: 'Fix conversion friction', desc: 'Resolve the size-guide drop-off in the Instagram checkout flow.', cta: 'See Heatmap' },
              { badge: 'Launch', badgeClass: 'text-green-400 bg-green-400/10', owner: 'Kai', title: 'Product launch sign-off', desc: "Final review of the 'Hourbour' eco-linen campaign assets.", cta: 'Open Studio' },
            ].map((p) => (
              <div key={p.badge} className="glass-card p-6 rounded-[18px]">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${p.badgeClass}`}>{p.badge}</span>
                  <span className="text-[10px] text-white/40">{p.owner}</span>
                </div>
                <h6 className="text-[15px] font-semibold text-white mb-4">{p.title}</h6>
                <p className="text-[13px] text-white/40 leading-relaxed mb-6">{p.desc}</p>
                <a href="#" className="text-[11px] font-bold text-[#0066cc] uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1">
                  {p.cta} <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Strategic Briefing */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-7 glass-card p-10 rounded-[18px]">
            <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">Strategic Briefing</h5>
            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <h6 className="text-[10px] font-bold text-[#0066cc] uppercase tracking-widest mb-2">What Changed</h6>
                <p className="text-[15px] text-white/80" style={{ lineHeight: '1.47' }}>TikTok engagement surged 42% following the &apos;Behind the Fiber&apos; organic series.</p>
              </div>
              <div>
                <h6 className="text-[10px] font-bold text-[#0066cc] uppercase tracking-widest mb-2">What Matters</h6>
                <p className="text-[15px] text-white/80" style={{ lineHeight: '1.47' }}>Transparency is now the #1 conversion driver for Gen Z cohorts, surpassing price.</p>
              </div>
              <div>
                <h6 className="text-[10px] font-bold text-[#0066cc] uppercase tracking-widest mb-2">What to do Now</h6>
                <p className="text-[15px] text-white/80" style={{ lineHeight: '1.47' }}>Deploy the &apos;Fiber Trace&apos; module to product pages immediately to capitalize on trust.</p>
              </div>
              <div>
                <h6 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Risk if Ignored</h6>
                <p className="text-[15px] text-white/80" style={{ lineHeight: '1.47' }}>Loss of market share to &apos;Everlane&apos; who are prepping a similar transparency push.</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 bg-white/5 border border-white/10 p-10 rounded-[18px] flex flex-col justify-between">
            <div>
              <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-6">CEO Readout</h5>
              <p className="text-[17px] text-white/80 italic" style={{ lineHeight: '1.47' }}>
                &quot;The momentum is shifting toward radical honesty. Our audience isn&apos;t just buying linen; they&apos;re buying our integrity. We need to move from &apos;telling&apos; to &apos;showing&apos; our supply chain by EOM.&quot;
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95">
                <span className="material-symbols-outlined text-[16px]">download</span> Download
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95">
                <span className="material-symbols-outlined text-[16px]">share</span> Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0066cc]/20 border border-[#0066cc]/30 text-[#0066cc] hover:bg-[#0066cc]/30 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95">
                <span className="material-symbols-outlined text-[16px]">bolt</span> War Room
              </button>
            </div>
          </div>
        </section>

        {/* Performance Breakdown */}
        <section className="mb-16">
          <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">Performance Breakdown</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Revenue Efficiency', value: '1.42', trend: '+0.12', trendClass: 'text-green-400', note: 'LTV/CAC ratio is improving as retention spikes.' },
              { label: 'Brand Strength', value: '82%', trend: 'Stable', trendClass: 'text-green-400', note: 'Sentiment remains high despite logistics delays.' },
              { label: 'Audience Growth', value: '4.2K', trend: 'New/Day', trendClass: 'text-green-400', note: 'Strongest organic pull in LinkedIn professional sector.' },
              { label: 'Content Output', value: '28', trend: 'Low', trendClass: 'text-amber-400', note: 'Production bottleneck in creative studio detected.' },
              { label: 'Conversion Pressure', value: '3.1%', trend: '-0.4%', trendClass: 'text-red-400', note: 'Mobile checkout speed is lagging below industry avg.' },
              { label: 'Competitive Threat', value: 'Moderate', trend: '', trendClass: '', note: 'Reformation scaling presence in SE Asia market.' },
            ].map((m) => (
              <div key={m.label} className="glass-card p-6 rounded-[18px]">
                <h6 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">{m.label}</h6>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-semibold text-white">{m.value}</span>
                  {m.trend && <span className={`text-[11px] font-bold ${m.trendClass}`}>{m.trend}</span>}
                </div>
                <p className="text-[13px] text-white/40 italic" style={{ lineHeight: '1.47' }}>{m.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Channel Snapshot */}
        <section className="mb-16">
          <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-8">Channel Snapshot</h5>
          <div className="glass-card rounded-[18px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  {['Channel', 'Reach', 'Engagement', 'CAC', 'Trend', 'Strategic Role'].map((h, i) => (
                    <th key={h} className={`px-8 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[13px] text-white/80">
                {[
                  { channel: 'TikTok', reach: '1.2M', eng: '8.4%', engClass: 'text-green-400', cac: '$4.20', trendIcon: 'trending_up', trendClass: 'text-green-400', role: 'Primary', roleClass: 'bg-[#0066cc]/20 text-[#0066cc] border-[#0066cc]/30' },
                  { channel: 'Instagram', reach: '840K', eng: '2.1%', engClass: 'text-red-400', cac: '$12.80', trendIcon: 'trending_down', trendClass: 'text-red-400', role: 'Reset', roleClass: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
                  { channel: 'LinkedIn', reach: '120K', eng: '4.8%', engClass: 'text-green-400', cac: '$2.10', trendIcon: 'trending_up', trendClass: 'text-green-400', role: 'Build', roleClass: 'bg-green-400/10 text-green-400 border-green-400/20' },
                ].map((row) => (
                  <tr key={row.channel} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 font-semibold">{row.channel}</td>
                    <td className="px-8 py-5">{row.reach}</td>
                    <td className={`px-8 py-5 ${row.engClass}`}>{row.eng}</td>
                    <td className="px-8 py-5">{row.cac}</td>
                    <td className="px-8 py-5">
                      <span className={`material-symbols-outlined text-sm ${row.trendClass}`}>{row.trendIcon}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${row.roleClass}`}>{row.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </>
  );
}
