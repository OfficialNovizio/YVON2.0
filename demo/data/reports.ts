// demo/data/reports.ts
// MOCK data for visual development — swap imports to @/lib/reports for live data
// Delete this entire /demo folder when ready for production-only mode.

import type { Report } from '@/lib/reports'

export const mockAnalyticsReport: Report = {
  id: 'demo-analytics-001',
  ventureId: 'novizio',
  reportType: 'analytics',
  periodStart: '2026-04-13',
  periodEnd: '2026-05-13',
  title: 'Analytics Report — Novizio',
  summary: `ANALYTICS SNAPSHOT
Period: last 30 days
Sessions: 2,840 — up 12% MoM
Bounce rate: 42% — down 3% MoM
Top page: /pricing

ANOMALIES
- Instagram organic traffic down 18% vs 7-day average — content switch needed

CONTENT SIGNAL
Top performer: IG Reel "Behind the Seam" — composite score 87
Pattern: Emotional storytelling outperforms educational content 2.4×

CHANNEL HEALTH
TikTok: 1.2M reach, 8.4% engagement rate — primary growth channel
Instagram: 840K reach, 2.1% engagement — declining, needs format change
LinkedIn: 120K reach, 4.8% engagement — underinvested relative to performance

KEY INSIGHT
Instagram content must shift from product showcase to emotional narrative to recover engagement trajectory.`,
  data: {
    sessions: 2840,
    pageviews: 12400,
    bounceRate: 0.42,
    topPages: ['/pricing', '/products', '/about'],
    period: '30d',
  },
  anomalies: {
    instagramTrafficDrop: -18,
    youtubeViewsSpike: 34,
  },
  reportNumber: 12,
  createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
}

export const mockMarketingReport: Report = {
  id: 'demo-marketing-001',
  ventureId: 'novizio',
  reportType: 'marketing',
  periodStart: '2026-05-06',
  periodEnd: '2026-05-13',
  title: 'Marketing Report — Novizio',
  summary: `CONTENT OUTPUT
Total scored: 14 pieces
Top piece: "Behind the Seam: The tailor who makes our linen" — score: 87 — emotional storytelling, high save rate
Worst piece: "5% off linen this weekend" — score: 34 — pure promotion, no narrative

PATTERN
Top 3 all use curiosity gap + emotional payoff. Bottom 3 all use promotional framing.
Emotional content saves at 4.7% rate vs promotional at 0.8%.

VARIANT QUEUE
2 pending variants from last flywheel run — both on Instagram Reels format

SPRINT STATUS
48h sprint active — Kai+Nate+Rio+Lena currently pitching

RECOMMENDATION
Kill promotional carousels, double down on narrative-driven Reels — the data is unambiguous.`,
  data: {
    totalScored: 14,
    topScore: 87,
    worstScore: 34,
    variantsPending: 2,
  },
  anomalies: null,
  reportNumber: 8,
  createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
}

export const mockCompetitorReport: Report = {
  id: 'demo-competitor-001',
  ventureId: 'novizio',
  reportType: 'competitor',
  periodStart: '2026-05-06',
  periodEnd: '2026-05-13',
  title: 'Competitor Report — Novizio',
  summary: `COMPETITOR LANDSCAPE
1. Reformation: Supply chain transparency series — 12% higher intent scores among Gen Z
   Gap: Focuses on sustainability but avoids emotional personal stories
2. Monzo: "Honest Money" series — 23 posts, avg 41K views, 8.2% save rate
   Gap: Educational breakdowns only — zero emotional or confessional content
3. Everlane: "Radical Transparency" campaign — declining engagement (-8% MoM)
   Gap: Format stale, audience fatigued on factory tours

UNCLAIMED TERRITORY
"Micro-finance confessions" — keywords: [money shame, financial honesty, spending psychology]
Saturation: 12% — no major competitor owns this space
Urgency: HIGH — Monzo could enter within 60 days

MARKET OPPORTUNITY
Own the emotional finance space before Monzo pivots — first-mover advantage in fintech storytelling

URGENCY
HIGH — Monzo's content team is hiring narrative specialists, signal they're exploring this territory`,
  data: {
    competitorsTracked: 5,
    unclaimedTerritories: 2,
    highUrgencyCount: 1,
  },
  anomalies: null,
  reportNumber: 6,
  createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
}

export const mockReports = {
  analytics: mockAnalyticsReport,
  marketing: mockMarketingReport,
  competitor: mockCompetitorReport,
}
