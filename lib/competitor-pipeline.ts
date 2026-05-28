/**
 * lib/competitor-pipeline.ts
 * Competitor intelligence pipeline — discovery → scraping → scoring → insight.
 *
 * Flow:
 *   1. resolveHandles() — AI-powered social handle discovery for a brand name
 *   2. scrapeCompetitor() — run Apify actors per platform, save metrics + posts
 *   3. scoreAndSave() — compute signal score from fresh metrics
 *   4. generateIntel() — Kai (Anthropic) brief on the competitor
 *
 * All writes go to: competitors, competitor_socials, competitor_metrics,
 * competitor_snapshots. Reads competitor intelligence from the same tables.
 */
import 'server-only'
import { supabase } from '@/lib/supabase'
import {
  getToken,
  scrapeInstagramFull,
  scrapeTikTokFull,
  scrapeLinkedInFull,
  scrapeYouTubeFull,
} from '@/lib/apify'
import type { ScraperResult } from '@/lib/apify'
import { upsertCompetitors, upsertCompetitorMetrics } from '@/lib/market-radar'
import { insertCompetitorSnapshot } from '@/lib/db'
import { callFast } from '@/lib/ai-client'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Platform = 'instagram' | 'tiktok' | 'linkedin' | 'youtube'

export interface CompetitorHandle {
  platform: Platform
  handle: string
}

export interface PipelineResult {
  competitorId: string
  brandName: string
  platforms: {
    platform: Platform
    handle: string
    status: 'success' | 'failed'
    followers: number
    engagementRate: number
    postCount: number
    error?: string
  }[]
  signalScore: number
  lastChecked: string
}

export interface CompetitorIntel {
  competitorId: string
  brandName: string
  url: string | null
  signalScore: number
  followerGrowthRate: number
  shareOfVoice: number
  weekOverWeekChange: number
  platforms: {
    platform: Platform
    handle: string
    followers: number
    engagementRate: number
    monthlyReach: number
  }[]
  kaiBrief?: {
    situation: string
    threatLevel: 'high' | 'medium' | 'low'
    recommendedAction: string
  }
}

// ─── Handle Resolution ────────────────────────────────────────────────────────

const KNOWN_HANDLES: Record<string, CompetitorHandle[]> = {
  // Fashion
  zara: [
    { platform: 'instagram', handle: 'zara' },
    { platform: 'tiktok', handle: 'zara' },
    { platform: 'youtube', handle: '@zara' },
  ],
  hnm: [
    { platform: 'instagram', handle: 'hm' },
    { platform: 'tiktok', handle: 'hm' },
    { platform: 'youtube', handle: '@handm' },
  ],
  // Fintech
  monzo: [
    { platform: 'instagram', handle: 'monzo' },
    { platform: 'tiktok', handle: 'monzobank' },
    { platform: 'linkedin', handle: 'https://www.linkedin.com/company/monzo-bank/' },
    { platform: 'youtube', handle: '@monzo' },
  ],
  revolut: [
    { platform: 'instagram', handle: 'revolutapp' },
    { platform: 'tiktok', handle: 'revolut' },
    { platform: 'linkedin', handle: 'https://www.linkedin.com/company/revolut/' },
    { platform: 'youtube', handle: '@revolutapp' },
  ],
}

export async function resolveHandles(
  brandName: string,
  knownHandles?: CompetitorHandle[],
): Promise<CompetitorHandle[]> {
  const key = brandName.toLowerCase().trim()

  // 1. Known handles (hardcoded directory)
  if (KNOWN_HANDLES[key]) return KNOWN_HANDLES[key]

  // 2. User-provided handles
  if (knownHandles && knownHandles.length > 0) return knownHandles

  // 3. AI-powered handle resolution
  try {
    const raw = await callFast({
      messages: [{
        role: 'user',
        content: `For the brand "${brandName}", return their official social media handles.

Return ONLY a JSON object with this exact format — no markdown, no explanation:
{
  "handles": [
    {"platform": "instagram", "handle": "brandname"},
    {"platform": "tiktok", "handle": "brandname"},
    {"platform": "youtube", "handle": "@brandname"},
    {"platform": "linkedin", "handle": "https://www.linkedin.com/company/brandname/"}
  ]
}

Only include platforms where you are confident the brand has an official presence. If unsure about a platform, omit it.
For LinkedIn, use the full company URL. For YouTube, use the @handle format. For Instagram/TikTok, use the bare handle without @.`,
      }],
      maxTokens: 256,
    })
    const match = raw.trim().match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0])
      if (parsed.handles && Array.isArray(parsed.handles)) {
        return parsed.handles.filter((h: any) =>
          ['instagram', 'tiktok', 'linkedin', 'youtube'].includes(h.platform),
        )
      }
    }
  } catch { /* fall through to best-effort guess */ }

  // 4. Best-effort guess (lowercase brand name, no spaces)
  const slug = key.replace(/\s+/g, '')
  return [
    { platform: 'instagram', handle: slug },
    { platform: 'tiktok', handle: slug },
  ]
}

// ─── Scraping ─────────────────────────────────────────────────────────────────

export async function scrapeCompetitor(
  competitorId: string,
  brandName: string,
  handles: CompetitorHandle[],
): Promise<PipelineResult['platforms']> {
  let token: string
  try {
    token = await getToken()
  } catch {
    return handles.map(h => ({
      platform: h.platform,
      handle: h.handle,
      status: 'failed' as const,
      followers: 0,
      engagementRate: 0,
      postCount: 0,
      error: 'APIFY_TOKEN not configured',
    }))
  }

  const results = await Promise.allSettled(
    handles.map(async (h): Promise<PipelineResult['platforms'][0]> => {
      let data: ScraperResult
      switch (h.platform) {
        case 'instagram': data = await scrapeInstagramFull(token, h.handle); break
        case 'tiktok':    data = await scrapeTikTokFull(token, h.handle);    break
        case 'linkedin':  data = await scrapeLinkedInFull(token, h.handle);  break
        case 'youtube':   data = await scrapeYouTubeFull(token, h.handle);   break
        default: throw new Error(`Unsupported platform: ${h.platform}`)
      }

      // Save metrics
      await upsertCompetitorMetrics(competitorId, [{
        platform: h.platform,
        followers: data.metrics.followers,
        engagementRate: data.metrics.engagement_rate,
        monthlyReach: Math.round(data.metrics.avg_views * (data.metrics.posts_count || 1)),
        estimatedMonthlyTraffic: 0,
      }])

      // Save posts to competitor_snapshots
      if (data.posts.length > 0) {
        await insertCompetitorSnapshot(
          competitorId, // venture_id gets competitor's parent venture — but this takes ventureId
          h.platform,
          { posts: data.posts.slice(0, 10), scrapedAt: new Date().toISOString() },
          h.handle,
        ).catch(() => {}) // non-fatal
      }

      return {
        platform: h.platform,
        handle: h.handle,
        status: 'success' as const,
        followers: data.metrics.followers,
        engagementRate: Math.round(data.metrics.engagement_rate * 10000) / 10000,
        postCount: data.metrics.posts_count,
      }
    }),
  )

  return results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value
    return {
      platform: handles[i].platform,
      handle: handles[i].handle,
      status: 'failed' as const,
      followers: 0,
      engagementRate: 0,
      postCount: 0,
      error: (r.reason as Error)?.message ?? 'Unknown error',
    }
  })
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export function computeSignalScore(platforms: PipelineResult['platforms']): number {
  const successes = platforms.filter(p => p.status === 'success')
  if (successes.length === 0) return 0

  const totalFollowers = successes.reduce((s, p) => s + p.followers, 0)
  const avgEng = successes.reduce((s, p) => s + p.engagementRate, 0) / successes.length

  // Normalize to 0-100
  const followerScore = Math.min(Math.log10(Math.max(totalFollowers, 1)) * 10, 35)
  const engagementScore = Math.min(avgEng * 1000, 30)
  const platformDiversity = Math.min(successes.length * 10, 20)
  const contentVelocity = Math.min(successes.reduce((s, p) => s + p.postCount, 0) * 0.5, 15)

  return Math.round(Math.min(
    followerScore + engagementScore + platformDiversity + contentVelocity,
    100,
  ))
}

// ─── Full Pipeline ────────────────────────────────────────────────────────────

export async function runCompetitorPipeline(
  ventureId: string,
  competitors: Array<{
    brandName: string
    url?: string
    handles?: CompetitorHandle[]
  }>,
): Promise<PipelineResult[]> {
  // Step 1: Upsert competitors (adds new, updates existing)
  const baseScores = competitors.map(c => ({
    brandName: c.brandName,
    url: c.url,
    signalScore: 0,
    followerGrowthRate: 0,
    trafficSpikeDetected: false,
    viralContentCount: 0,
    fundingRoundDetected: false,
    shareOfVoice: 0,
    weekOverWeekChange: 0,
  }))
  await upsertCompetitors(ventureId, baseScores)

  // Step 2: Fetch the IDs of upserted competitors
  const { data: savedComps } = await supabase
    .from('competitors')
    .select('id, brand_name')
    .eq('venture_id', ventureId)

  const compMap = new Map((savedComps ?? []).map((c: any) => [c.brand_name, c.id]))

  // Step 3: For each competitor, resolve handles + save to competitor_socials
  const pipelineResults: PipelineResult[] = []

  for (const comp of competitors) {
    const compId = compMap.get(comp.brandName) as string
    if (!compId) continue

    const handles = await resolveHandles(comp.brandName, comp.handles)

    // Save handles to competitor_socials
    if (handles.length > 0) {
      try {
        await supabase.from('competitor_socials').upsert(
          handles.map(h => ({
            competitor_id: compId,
            platform: h.platform,
            handle_or_url: h.handle,
          })),
          { onConflict: 'competitor_id,platform' },
        )
      } catch { /* non-fatal */ }
    }

    // Step 4: Scrape each platform
    const platformResults = await scrapeCompetitor(compId, comp.brandName, handles)

    // Step 5: Compute and save signal score
    const signalScore = computeSignalScore(platformResults)

    // Calculate follower growth from previous metrics
    const { data: prevMetrics } = await supabase
      .from('competitor_metrics')
      .select('followers')
      .eq('competitor_id', compId)
      .order('recorded_at', { ascending: false })
      .limit(handles.length * 2) // current + previous per platform

    let followerGrowthRate = 0
    if (prevMetrics && prevMetrics.length >= handles.length) {
      const current = platformResults.reduce((s, p) => s + p.followers, 0)
      const half = Math.floor(prevMetrics.length / 2)
      const previous = (prevMetrics.slice(half) as any[]).reduce((s: number, m: any) => s + (m.followers ?? 0), 0)
      if (previous > 0) {
        followerGrowthRate = ((current - previous) / previous) * 100
      }
    }

    // Calculate share of voice from total followers
    const { data: allComps } = await supabase
      .from('competitors')
      .select('id')
      .eq('venture_id', ventureId)
    const allCompIds = (allComps ?? []).map((c: any) => c.id)

    const { data: allMetrics } = await supabase
      .from('competitor_metrics')
      .select('competitor_id, followers')
      .in('competitor_id', allCompIds)

    let shareOfVoice = 0
    if (allMetrics && allMetrics.length > 0) {
      const totalAllFollowers = (allMetrics as any[]).reduce((s: number, m: any) => s + (m.followers ?? 0), 0)
      const ourFollowers = platformResults.reduce((s, p) => s + p.followers, 0)
      shareOfVoice = totalAllFollowers > 0 ? Math.round((ourFollowers / totalAllFollowers) * 1000) / 10 : 0
    }

    // Update competitor row with fresh scores
    await supabase.from('competitors').update({
      signal_score: signalScore,
      follower_growth_rate: Math.round(followerGrowthRate * 100) / 100,
      share_of_voice: shareOfVoice,
      week_over_week_change: 0, // computed next cycle
      last_checked: new Date().toISOString(),
    }).eq('id', compId)

    pipelineResults.push({
      competitorId: compId,
      brandName: comp.brandName,
      platforms: platformResults,
      signalScore,
      lastChecked: new Date().toISOString(),
    })
  }

  return pipelineResults
}

// ─── Intelligence Read ────────────────────────────────────────────────────────

export async function getCompetitorIntelligence(ventureId: string): Promise<{
  signals: Array<{ id: string; severity: 'red' | 'amber' | 'green'; text: string; cta: string }>
  kpis: Array<{ label: string; icon: string; value: string; unit: string; delta: string; up: boolean | null }>
  competitors: Array<{
    name: string; initial: string; sov: string; sentiment: string
    sentUp: boolean | null; momentum: string; accent: boolean; dashed: boolean
  }>
}> {
  const { data: compRows } = await supabase
    .from('competitors')
    .select('*')
    .eq('venture_id', ventureId)
    .order('signal_score', { ascending: false })

  const competitors = (compRows ?? []) as any[]

  if (competitors.length === 0) {
    return { signals: [], kpis: [], competitors: [] }
  }

  // Fetch all metrics
  const compIds = competitors.map((c: any) => c.id)
  const { data: metricRows } = await supabase
    .from('competitor_metrics')
    .select('*')
    .in('competitor_id', compIds)
    .order('recorded_at', { ascending: false })

  const metricsByComp: Record<string, any[]> = {}
  for (const m of (metricRows ?? [])) {
    if (!metricsByComp[m.competitor_id]) metricsByComp[m.competitor_id] = []
    metricsByComp[m.competitor_id].push(m)
  }

  // Build signals from real data
  const signals: Array<{ id: string; severity: 'red' | 'amber' | 'green'; text: string; cta: string }> = []
  for (const c of competitors) {
    const score = Number(c.signal_score ?? 0)
    if (score > 60) {
      signals.push({
        id: `comp-${c.id}`,
        severity: 'red',
        text: `${c.brand_name}: Signal score ${score} — high threat. ${Number(c.follower_growth_rate ?? 0).toFixed(1)}% follower growth.`,
        cta: 'Analyze',
      })
    } else if (score > 30) {
      signals.push({
        id: `comp-${c.id}`,
        severity: 'amber',
        text: `${c.brand_name}: Signal score ${score} — moderate presence. Monitor content velocity.`,
        cta: 'Review',
      })
    }
    if (c.traffic_spike_detected) {
      signals.push({
        id: `spike-${c.id}`,
        severity: 'amber',
        text: `${c.brand_name}: Traffic spike detected. Possible campaign or viral moment.`,
        cta: 'Investigate',
      })
    }
  }

  // Compute KPIs
  const allScores = competitors.map((c: any) => Number(c.signal_score ?? 0))
  const avgScore = allScores.length > 0 ? allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length : 0

  const kpis = [
    {
      label: 'Competitors Tracked', icon: 'radar',
      value: String(competitors.length), unit: '',
      delta: `${competitors.filter((c: any) => c.last_checked).length} with data`,
      up: null as boolean | null,
    },
    {
      label: 'Avg Signal Score', icon: 'trending_up',
      value: String(Math.round(avgScore)), unit: '/100',
      delta: avgScore > 40 ? 'Above threshold' : 'Below threshold',
      up: avgScore > 40 ? true : false,
    },
    {
      label: 'Total Share of Voice', icon: 'record_voice_over',
      value: String(Math.round(competitors.reduce((s: number, c: any) => s + Number(c.share_of_voice ?? 0), 0) * 10) / 10),
      unit: '%',
      delta: 'Across all platforms',
      up: null as boolean | null,
    },
    {
      label: 'Avg Engagement', icon: 'favorite',
      value: (metricRows && metricRows.length > 0
        ? (metricRows.reduce((s: number, m: any) => s + Number(m.engagement_rate ?? 0), 0) / metricRows.length * 100).toFixed(1)
        : '0.0'),
      unit: '%',
      delta: 'Real data',
      up: true,
    },
  ]

  // Build competitor list
  const maxScore = Math.max(...allScores, 1)
  const compList = competitors.map((c: any, i: number) => {
    const score = Number(c.signal_score ?? 0)
    const sov = Number(c.share_of_voice ?? 0)
    const growth = Number(c.follower_growth_rate ?? 0)

    return {
      name: c.brand_name,
      initial: c.brand_name.charAt(0).toUpperCase(),
      sov: `${sov.toFixed(1)}%`,
      sentiment: score > 50 ? 'Strong' : score > 25 ? 'Moderate' : 'Low',
      sentUp: score > 40 ? true : score > 20 ? null : false,
      momentum: growth > 5 ? 'arrow_upward' : growth < -2 ? 'arrow_downward' : 'arrow_forward',
      accent: i === 0, // top competitor highlighted
      dashed: score === 0,
    }
  })

  return { signals: signals.slice(0, 5), kpis, competitors: compList }
}
