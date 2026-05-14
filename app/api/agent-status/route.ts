// GET /api/agent-status?ventureId=x
// Returns live agent status derived from tasks + activity_feed.
// Falls back to demo data when no live data exists — remove getDemoData() when real tasks flow.

import { cookies } from 'next/headers'
import { getTasks, getActivityFeed } from '@/lib/db'
import type { AgentId } from '@/lib/types'

// ── Agent display config ────────────────────────────────────────────────────────
const AGENT_META: Record<string, {
  name: string
  role: 'tech' | 'brand' | 'ops' | 'exec'
  dept: string
  idle: string
}> = {
  'marcus-ceo':         { name: 'Marcus', role: 'exec',  dept: 'Executive',  idle: 'Standby · CEO agent' },
  'diana-coo':          { name: 'Diana',  role: 'exec',  dept: 'Strategy',   idle: 'Standby · brand transparency' },
  'dev-lead':           { name: 'Dev',    role: 'tech',  dept: 'Technical',  idle: 'Standby · engineering' },
  'raj-backend':        { name: 'Raj',    role: 'tech',  dept: 'Technical',  idle: 'Standby · infra' },
  'mia-frontend':       { name: 'Mia',    role: 'brand', dept: 'Brand',      idle: 'Standby · UI/UX' },
  'quinn-qa':           { name: 'Quinn',  role: 'tech',  dept: 'Technical',  idle: 'Standby · QA' },
  'kai-analyst':        { name: 'Kai',    role: 'tech',  dept: 'Marketing',  idle: 'Standby · analytics' },
  'lena-brand':         { name: 'Lena',   role: 'ops',   dept: 'Operations', idle: 'Standby · brand copy' },
  'rio-ads':            { name: 'Rio',    role: 'brand', dept: 'Marketing',  idle: 'Standby · paid ads' },
  'nate-growth':        { name: 'Nate',   role: 'ops',   dept: 'Operations', idle: 'Standby · growth' },
  'atlas-art-director': { name: 'Atlas',  role: 'ops',   dept: 'Operations', idle: 'Standby · art direction' },
  'pixel-production':   { name: 'Pixel',  role: 'brand', dept: 'Brand',      idle: 'Standby · creative' },
  'felix-finance':      { name: 'Felix',  role: 'exec',  dept: 'Strategy',   idle: 'Standby · finance' },
}

export interface AgentStatusItem {
  id: string
  name: string
  role: 'tech' | 'brand' | 'ops' | 'exec'
  dept: string
  status: 'active' | 'idle' | 'done'
  currentTask: string
  when?: string
}

export interface AgentStatusResponse {
  active: AgentStatusItem[]
  idle: AgentStatusItem[]
  completedToday: AgentStatusItem[]
  isDemo: boolean
  fetchedAt: string
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  if (m < 5)  return 'Just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (h < 48) return 'Yesterday'
  return `${Math.floor(h / 24)}d ago`
}

// ── Demo fallback ── remove when real tasks flow ────────────────────────────────
function getDemoData(): AgentStatusResponse {
  return {
    active: [
      { id: 'kai-analyst', name: 'Kai',  role: 'tech',  dept: 'Marketing', status: 'active', currentTask: 'Analyzing analytics data' },
      { id: 'rio-ads',     name: 'Rio',  role: 'brand', dept: 'Marketing', status: 'active', currentTask: 'Running TikTok ad campaigns' },
      { id: 'dev-lead',    name: 'Dev',  role: 'tech',  dept: 'Technical', status: 'active', currentTask: 'Building size guide page' },
    ],
    idle: [
      { id: 'diana-coo',          name: 'Diana',  role: 'exec',  dept: 'Strategy',   status: 'idle', currentTask: 'Standby · brand transparency' },
      { id: 'raj-backend',        name: 'Raj',    role: 'tech',  dept: 'Technical',  status: 'idle', currentTask: 'Standby · infra' },
      { id: 'mia-frontend',       name: 'Mia',    role: 'brand', dept: 'Brand',      status: 'idle', currentTask: 'Standby · voice ops' },
      { id: 'lena-brand',         name: 'Lena',   role: 'ops',   dept: 'Operations', status: 'idle', currentTask: 'Standby · supply chain' },
      { id: 'nate-growth',        name: 'Nate',   role: 'ops',   dept: 'Operations', status: 'idle', currentTask: 'Standby · conversion ops' },
      { id: 'quinn-qa',           name: 'Quinn',  role: 'tech',  dept: 'Technical',  status: 'idle', currentTask: 'Standby · QA' },
      { id: 'atlas-art-director', name: 'Atlas',  role: 'ops',   dept: 'Operations', status: 'idle', currentTask: 'Standby · logistics' },
      { id: 'pixel-production',   name: 'Pixel',  role: 'brand', dept: 'Brand',      status: 'idle', currentTask: 'Standby · creative' },
      { id: 'felix-finance',      name: 'Felix',  role: 'exec',  dept: 'Strategy',   status: 'idle', currentTask: 'Standby · finance' },
      { id: 'marcus-ceo',         name: 'Marcus', role: 'exec',  dept: 'Executive',  status: 'idle', currentTask: 'Standby · CEO agent' },
    ],
    completedToday: [
      { id: 'kai-analyst', name: 'Kai',    role: 'tech',  dept: 'Today', status: 'done', currentTask: 'Analytics report delivered',     when: '4h ago' },
      { id: 'marcus-ceo',  name: 'Marcus', role: 'exec',  dept: 'Today', status: 'done', currentTask: 'Morning CEO brief published',     when: '6h ago' },
      { id: 'mia-frontend',name: 'Mia',    role: 'brand', dept: 'Today', status: 'done', currentTask: 'Brand voice guidelines updated',  when: '8h ago' },
      { id: 'dev-lead',    name: 'Dev',    role: 'tech',  dept: 'Today', status: 'done', currentTask: 'Size guide page pushed',          when: 'Yesterday' },
    ],
    isDemo: true,
    fetchedAt: new Date().toISOString(),
  }
}

export async function GET(request: Request): Promise<Response> {
  const url         = new URL(request.url)
  const cookieStore = await cookies()
  const vId = url.searchParams.get('ventureId') || cookieStore.get('yvon_active_venture')?.value || 'novizio'

  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [tasks, activities] = await Promise.all([
      getTasks(vId),
      getActivityFeed(vId, 200),
    ])

    // Agents with in-progress tasks → Active
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress' && t.agentId)
    const activeAgentMap  = new Map<string, string>() // agentId → task title
    for (const t of inProgressTasks) {
      if (t.agentId && !activeAgentMap.has(t.agentId)) {
        activeAgentMap.set(t.agentId, t.title)
      }
    }

    // Activity events today → Done Today (most recent per agent)
    const todayActivities = activities.filter(a => new Date(a.createdAt) >= todayStart && a.agentId)
    const doneMap = new Map<string, { task: string; when: string }>()
    for (const act of todayActivities) {
      if (!act.agentId || doneMap.has(act.agentId)) continue
      doneMap.set(act.agentId, { task: act.message, when: relativeTime(act.createdAt) })
    }

    const hasRealData = inProgressTasks.length > 0 || todayActivities.length > 0
    if (!hasRealData) {
      return Response.json(getDemoData(), { headers: { 'Cache-Control': 'no-store' } })
    }

    // Build active + idle arrays from all known agents
    const active: AgentStatusItem[]  = []
    const idle:   AgentStatusItem[]  = []

    for (const [id, meta] of Object.entries(AGENT_META)) {
      if (activeAgentMap.has(id)) {
        active.push({ id, ...meta, status: 'active', currentTask: activeAgentMap.get(id)! })
      } else {
        idle.push({ id, ...meta, status: 'idle', currentTask: meta.idle })
      }
    }

    // Build completedToday from activity map
    const completedToday: AgentStatusItem[] = []
    for (const [id, info] of doneMap.entries()) {
      const meta = AGENT_META[id as AgentId]
      if (!meta) continue
      completedToday.push({ id, ...meta, status: 'done', currentTask: info.task, when: info.when, dept: 'Today' })
    }

    return Response.json(
      { active, idle, completedToday, isDemo: false, fetchedAt: new Date().toISOString() } satisfies AgentStatusResponse,
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[agent-status]', msg)
    // On error always return demo data so the UI never breaks
    return Response.json(getDemoData(), { headers: { 'Cache-Control': 'no-store' } })
  }
}
