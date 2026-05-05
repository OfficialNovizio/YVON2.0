'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { AgentId, ExecutionPlan, RoutingResult, AgentRunStatus, WarRoomEvent, WarRoomPlanRecord } from '@/lib/types';

// ─── Agent meta (display only — no runtime import of full agents.ts) ──────────

const AGENT_META: Record<AgentId, { name: string; icon: string; color: string; role: string }> = {
  'marcus-ceo':        { name: 'Marcus',  icon: '👑', color: '#F59E0B', role: 'CEO' },
  'diana-coo':         { name: 'Diana',   icon: '⚙️', color: '#94A3B8', role: 'COO' },
  'dev-lead':          { name: 'Dev',     icon: '💻', color: '#06B6D4', role: 'Lead Dev' },
  'raj-backend':       { name: 'Raj',     icon: '🔧', color: '#8B5CF6', role: 'Backend' },
  'mia-frontend':      { name: 'Mia',     icon: '🎨', color: '#D946EF', role: 'Frontend' },
  'quinn-qa':          { name: 'Quinn',   icon: '🧪', color: '#10B981', role: 'QA' },
  'kai-analyst':       { name: 'Kai',     icon: '📊', color: '#3B82F6', role: 'Analyst' },
  'lena-brand':        { name: 'Lena',    icon: '✍️', color: '#14B8A6', role: 'Brand Voice' },
  'rio-ads':           { name: 'Rio',     icon: '📈', color: '#F97316', role: 'Ads' },
  'nate-growth':       { name: 'Nate',    icon: '🚀', color: '#22C55E', role: 'Growth' },
  'atlas-art-director':{ name: 'Atlas',   icon: '🎨', color: '#6366F1', role: 'Art Director' },
  'pixel-production':  { name: 'Pixel',   icon: '⚡', color: '#8B5CF6', role: 'Production' },
  'felix-finance':     { name: 'Felix',   icon: '💰', color: '#10B981', role: 'Finance' },
  'daniel-kahneman':  { name: 'Kahneman',icon: '🧠', color: '#A78BFA', role: 'Behavioral Economist' },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionStatus = 'idle' | 'planning' | 'executing' | 'synthesizing' | 'complete' | 'error';

interface TimelineEntry {
  id: number;
  time: string;
  message: string;
  type: 'plan' | 'agent' | 'error' | 'complete' | 'routing' | 'retry' | 'handoff';
  agentId?: AgentId;
}

interface WarRoomState {
  status: SessionStatus;
  plan: ExecutionPlan | null;
  routing: RoutingResult | null;
  activeAgents: AgentId[];
  agentStatus: Partial<Record<AgentId, AgentRunStatus>>;
  agentTasks: Partial<Record<AgentId, string>>;
  timeline: TimelineEntry[];
  synthesis: string;
  elapsed: number;
  confidence: number;
}

const INITIAL_STATE: WarRoomState = {
  status: 'idle',
  plan: null,
  routing: null,
  activeAgents: [],
  agentStatus: {},
  agentTasks: {},
  timeline: [],
  synthesis: '',
  elapsed: 0,
  confidence: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function now() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

let timelineId = 0;
function entry(message: string, type: TimelineEntry['type'], agentId?: AgentId): TimelineEntry {
  return { id: ++timelineId, time: now(), message, type, agentId };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: AgentRunStatus }) {
  const cls: Record<AgentRunStatus, string> = {
    idle:     'bg-white/20',
    working:  'bg-yellow-400 animate-pulse',
    done:     'bg-green-400',
    error:    'bg-red-400',
    retrying: 'bg-orange-400 animate-pulse',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${cls[status]}`} />;
}

function AgentCard({
  agentId,
  status,
  task,
  queued,
}: {
  agentId: AgentId;
  status: AgentRunStatus;
  task?: string;
  queued?: boolean;
}) {
  const meta = AGENT_META[agentId];
  const statusLabel: Record<AgentRunStatus, string> = {
    idle:     queued ? 'QUEUED' : 'STANDBY',
    working:  'WORKING',
    done:     'DONE',
    error:    'ERROR',
    retrying: 'RETRY',
  };
  const borderColor = status === 'done' ? 'border-green-400/30'
    : status === 'working' || status === 'retrying' ? 'border-yellow-400/30'
    : status === 'error' ? 'border-red-400/30'
    : queued ? 'border-purple-400/20'
    : 'border-white/5';

  return (
    <div className={`glass-card rounded-xl p-4 border ${borderColor} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{meta.icon}</span>
          <div>
            <p className="text-[13px] font-semibold text-white leading-none">{meta.name}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{meta.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot status={status} />
          <span className="text-[9px] font-bold tracking-widest text-white/40">{statusLabel[status]}</span>
        </div>
      </div>
      {task && (
        <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2 mt-1">{task}</p>
      )}
    </div>
  );
}

function TimelineRow({ entry: e }: { entry: TimelineEntry }) {
  const meta = e.agentId ? AGENT_META[e.agentId] : null;
  const typeColor: Record<TimelineEntry['type'], string> = {
    plan:    'text-[#0071e3]',
    agent:   'text-green-400',
    error:   'text-red-400',
    complete:'text-white/70',
    routing: 'text-yellow-400',
    retry:   'text-orange-400',
    handoff: 'text-purple-400',
  };
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="text-[10px] text-white/30 font-mono tabular-nums mt-0.5 flex-shrink-0">{e.time}</span>
      {meta && (
        <span className="text-[11px] flex-shrink-0" style={{ color: meta.color }}>
          {meta.icon} {meta.name}
        </span>
      )}
      <p className={`text-[11px] leading-relaxed ${typeColor[e.type]}`}>{e.message}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WarRoomPage() {
  const [input, setInput] = useState('');
  const [venture, setVenture] = useState('Novizio');
  const [state, setState] = useState<WarRoomState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);
  const synthRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll synthesis and timeline
  useEffect(() => {
    synthRef.current?.scrollTo({ top: synthRef.current.scrollHeight, behavior: 'smooth' });
  }, [state.synthesis]);
  useEffect(() => {
    timelineRef.current?.scrollTo({ top: timelineRef.current.scrollHeight, behavior: 'smooth' });
  }, [state.timeline]);

  const pushEntry = useCallback((e: TimelineEntry) => {
    setState(prev => ({ ...prev, timeline: [...prev.timeline, e] }));
  }, []);

  const run = useCallback(async () => {
    if (!input.trim() || state.status !== 'idle') return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState({ ...INITIAL_STATE, status: 'planning' });

    try {
      const res = await fetch('/api/team-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim(), ventureName: venture }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error('Stream failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const raw = line.slice(5).trim();
          if (raw === '[DONE]') {
            setState(prev => ({ ...prev, status: 'complete' }));
            continue;
          }

          let evt: WarRoomEvent;
          try { evt = JSON.parse(raw); } catch { continue; }

          switch (evt.type) {
            case 'routing':
              setState(prev => ({
                ...prev,
                routing: evt.routing,
                confidence: evt.confidence,
                activeAgents: evt.routing.specialists as AgentId[],
              }));
              pushEntry(entry(
                `Intent: ${evt.routing.intent} — routing to ${evt.routing.specialists.join(', ')}`,
                'routing'
              ));
              break;

            case 'plan':
              setState(prev => ({
                ...prev,
                status: 'executing',
                plan: evt.plan,
              }));
              if (evt.plan) {
                pushEntry(entry(
                  `Plan: ${evt.plan.objective}`,
                  'plan'
                ));
              }
              break;

            case 'agent_start':
              setState(prev => ({
                ...prev,
                agentStatus: { ...prev.agentStatus, [evt.agentId]: 'working' },
                agentTasks: { ...prev.agentTasks, [evt.agentId]: evt.task },
              }));
              pushEntry(entry(`Started`, 'agent', evt.agentId));
              break;

            case 'agent_complete':
              setState(prev => ({
                ...prev,
                agentStatus: { ...prev.agentStatus, [evt.agentId]: 'done' },
              }));
              pushEntry(entry(`Delivered — "${evt.previewText}..."`, 'agent', evt.agentId));
              break;

            case 'agent_error':
              setState(prev => ({
                ...prev,
                agentStatus: { ...prev.agentStatus, [evt.agentId]: 'error' },
              }));
              pushEntry(entry(`Error${evt.fatal ? ' (fatal)' : ''}: ${evt.error}`, 'error', evt.agentId));
              break;

            case 'retry':
              setState(prev => ({
                ...prev,
                agentStatus: { ...prev.agentStatus, [evt.agentId]: 'retrying' },
              }));
              pushEntry(entry(`Retrying (attempt ${evt.attempt})`, 'retry', evt.agentId));
              break;

            case 'handoff':
              pushEntry(entry(
                `Handoff → ${AGENT_META[evt.to]?.name ?? evt.to}: "${evt.summary}"`,
                'handoff',
                evt.from
              ));
              break;

            case 'text':
              setState(prev => ({
                ...prev,
                status: 'synthesizing',
                synthesis: prev.synthesis + evt.content,
              }));
              break;

            case 'plan_complete':
              setState(prev => ({ ...prev, elapsed: evt.elapsed }));
              pushEntry(entry(`Complete — ${(evt.elapsed / 1000).toFixed(1)}s`, 'complete'));
              break;

            case 'error':
              setState(prev => ({ ...prev, status: 'error' }));
              pushEntry(entry(`System error: ${evt.message}`, 'error'));
              break;
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setState(prev => ({ ...prev, status: 'error' }));
        pushEntry(entry(`Connection error: ${String(err)}`, 'error'));
      }
    }
  }, [input, venture, state.status, pushEntry]);

  const reset = () => {
    abortRef.current?.abort();
    setState(INITIAL_STATE);
    setInput('');
  };

  const statusLabel: Record<SessionStatus, string> = {
    idle:        'READY',
    planning:    'MARCUS PLANNING',
    executing:   'AGENTS WORKING',
    synthesizing:'MARCUS SYNTHESIZING',
    complete:    'COMPLETE',
    error:       'ERROR',
  };
  const statusColor: Record<SessionStatus, string> = {
    idle:        'text-white/30',
    planning:    'text-yellow-400',
    executing:   'text-[#0071e3]',
    synthesizing:'text-purple-400',
    complete:    'text-green-400',
    error:       'text-red-400',
  };

  const isRunning = state.status !== 'idle' && state.status !== 'complete' && state.status !== 'error';

  // ── Plan History ────────────────────────────────────────────────────────────
  const [history, setHistory] = useState<WarRoomPlanRecord[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/war-room-plans?venture=${encodeURIComponent(venture)}&limit=20`);
      if (res.ok) setHistory(await res.json() as WarRoomPlanRecord[]);
    } catch { /* silent */ } finally {
      setHistoryLoading(false);
    }
  }, [venture]);

  // Reload history when a session completes
  useEffect(() => {
    if (state.status === 'complete') {
      loadHistory();
      setHistoryOpen(true);
    }
  }, [state.status, loadHistory]);

  // Load history on first open
  const handleHistoryToggle = () => {
    const next = !historyOpen;
    setHistoryOpen(next);
    if (next && history.length === 0) loadHistory();
  };

  function formatElapsed(ms: number | null) {
    if (!ms) return '—';
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <main className="pt-20 px-6 pb-16 max-w-screen-2xl mx-auto">

      {/* Header */}
      <div className="flex items-end justify-between mb-8 pt-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-1">YVON OS</p>
          <h1 className="text-4xl font-semibold text-white" style={{ letterSpacing: '-0.02em' }}>
            War Room
          </h1>
          <p className="text-[13px] text-white/40 mt-1">CEO-orchestrated multi-agent execution</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-bold tracking-widest uppercase ${statusColor[state.status]}`}>
            {statusLabel[state.status]}
          </span>
          {state.elapsed > 0 && (
            <span className="text-[11px] text-white/30 font-mono">
              {(state.elapsed / 1000).toFixed(1)}s
            </span>
          )}
          {state.confidence > 0 && (
            <span className="text-[11px] text-white/30">
              {Math.round(state.confidence * 100)}% confidence
            </span>
          )}
        </div>
      </div>

      {/* Input + venture selector */}
      <div className="glass-card rounded-2xl p-5 mb-6 border border-white/5">
        <div className="flex gap-3 mb-3">
          <select
            value={venture}
            onChange={e => setVenture(e.target.value)}
            disabled={isRunning}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white/70 focus:outline-none focus:border-white/20 disabled:opacity-40"
          >
            <option value="Novizio">Novizio</option>
            <option value="Hourbour">Hourbour</option>
          </select>
          <div className="flex-1 flex gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); run(); } }}
              disabled={isRunning}
              placeholder="What do you need from the team? (Enter to send)"
              rows={2}
              className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-white/25 resize-none disabled:opacity-40"
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={run}
                disabled={isRunning || !input.trim()}
                className="px-5 py-2 rounded-xl bg-[#0071e3] text-white text-[13px] font-semibold hover:bg-[#0077ed] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-1"
              >
                {isRunning ? '...' : 'Send'}
              </button>
              {(isRunning || state.status !== 'idle') && (
                <button
                  onClick={reset}
                  className="px-5 py-2 rounded-xl bg-white/5 text-white/50 text-[13px] font-semibold hover:bg-white/10 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Plan banner */}
      {state.plan && (
        <div className="glass-card rounded-xl p-4 mb-6 border border-[#0071e3]/20 bg-[#0071e3]/5">
          <div className="flex items-start gap-4">
            <span className="text-[10px] font-bold tracking-widest text-[#0071e3] uppercase mt-0.5 flex-shrink-0">Marcus Plan</span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-white font-medium mb-1">{state.plan.objective}</p>
              <p className="text-[11px] text-white/40">
                {state.plan.order === 'sequential' ? 'Sequential' : 'Parallel'} ·{' '}
                Done when: {state.plan.definition_of_done}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main 3-column layout */}
      <div className="grid grid-cols-[280px_1fr_280px] gap-5">

        {/* Left: Agent status grid */}
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-3">Agent Status</p>
          <div className="space-y-3">
            {state.activeAgents.length === 0 ? (
              <div className="glass-card rounded-xl p-4 border border-white/5">
                <p className="text-[12px] text-white/20 text-center">Awaiting routing...</p>
              </div>
            ) : (
              state.activeAgents.map((id, i) => {
                const isSequential = state.plan?.order === 'sequential';
                const agentStatus = state.agentStatus[id] ?? 'idle';
                // In sequential mode, agents that haven't been touched yet are "queued"
                const isQueued = isSequential && agentStatus === 'idle' && i > 0 &&
                  state.activeAgents.slice(0, i).some(prev => (state.agentStatus[prev] ?? 'idle') !== 'done');
                return (
                  <AgentCard
                    key={id}
                    agentId={id}
                    status={agentStatus}
                    task={state.agentTasks[id]}
                    queued={isQueued}
                  />
                );
              })
            )}

            {/* Marcus synthesis card — always shown as endpoint */}
            {state.activeAgents.length > 0 && (
              <>
                <div className="flex items-center gap-2 px-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[9px] text-white/20">↓</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <div className={`glass-card rounded-xl p-4 border transition-all duration-300 ${
                  state.status === 'synthesizing' ? 'border-purple-400/30' :
                  state.status === 'complete' ? 'border-green-400/30' : 'border-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👑</span>
                      <div>
                        <p className="text-[13px] font-semibold text-white leading-none">Marcus</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">CEO Synthesis</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        state.status === 'synthesizing' ? 'bg-purple-400 animate-pulse' :
                        state.status === 'complete' ? 'bg-green-400' : 'bg-white/20'
                      }`} />
                      <span className="text-[9px] font-bold tracking-widest text-white/40">
                        {state.status === 'synthesizing' ? 'WRITING' :
                         state.status === 'complete' ? 'DONE' : 'WAITING'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: CEO synthesis output */}
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-3">Executive Response</p>
          <div
            ref={synthRef}
            className="glass-card rounded-2xl p-6 border border-white/5 min-h-[480px] max-h-[640px] overflow-y-auto"
          >
            {!state.synthesis && state.status === 'idle' && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <span className="text-2xl">👑</span>
                </div>
                <p className="text-[13px] text-white/20 max-w-xs leading-relaxed">
                  Send a request and Marcus will coordinate your agents to deliver a unified response.
                </p>
              </div>
            )}
            {!state.synthesis && state.status === 'planning' && (
              <div className="flex items-center gap-3 py-4">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <p className="text-[13px] text-white/40">Marcus is reviewing your request and planning...</p>
              </div>
            )}
            {!state.synthesis && state.status === 'executing' && (
              <div className="flex items-center gap-3 py-4">
                <div className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse" />
                <p className="text-[13px] text-white/40">Specialists working — Marcus will synthesize when ready...</p>
              </div>
            )}
            {state.synthesis && (
              <div className="prose prose-invert prose-sm max-w-none">
                <div
                  className="text-[14px] text-white/85 leading-relaxed whitespace-pre-wrap"
                  style={{ fontFamily: 'inherit' }}
                >
                  {state.synthesis}
                  {state.status === 'synthesizing' && (
                    <span className="inline-block w-0.5 h-4 bg-white/60 ml-0.5 animate-pulse align-text-bottom" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Execution timeline */}
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-3">Execution Log</p>
          <div
            ref={timelineRef}
            className="glass-card rounded-2xl p-4 border border-white/5 min-h-[480px] max-h-[640px] overflow-y-auto"
          >
            {state.timeline.length === 0 ? (
              <p className="text-[12px] text-white/20 text-center py-8">Events will appear here...</p>
            ) : (
              state.timeline.map(e => <TimelineRow key={e.id} entry={e} />)
            )}
          </div>
        </div>
      </div>

      {/* Work flow diagram */}
      {state.plan && state.activeAgents.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-white/5 mt-5">
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-4">Work Flow</p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sm">👑</span>
              <span className="text-[12px] text-white/50 font-medium">Marcus</span>
              <span className="text-[10px] text-white/20 ml-1">PLAN</span>
            </div>
            <span className="text-white/20 text-lg">→</span>
            {state.activeAgents.map((id, i) => {
              const meta = AGENT_META[id];
              const s = state.agentStatus[id] ?? 'idle';
              return (
                <div key={id} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 rounded-lg px-3 py-2 border transition-all ${
                    s === 'done' ? 'bg-green-400/10 border-green-400/20' :
                    s === 'working' || s === 'retrying' ? 'bg-yellow-400/10 border-yellow-400/20' :
                    s === 'error' ? 'bg-red-400/10 border-red-400/20' :
                    'bg-white/5 border-transparent'
                  }`}>
                    <span className="text-sm">{meta.icon}</span>
                    <span className="text-[12px] text-white/70 font-medium">{meta.name}</span>
                    {s === 'done' && <span className="text-green-400 text-[10px] ml-1">✓</span>}
                    {(s === 'working' || s === 'retrying') && <span className="text-yellow-400 text-[10px] ml-1 animate-pulse">●</span>}
                    {s === 'error' && <span className="text-red-400 text-[10px] ml-1">✗</span>}
                  </div>
                  {i < state.activeAgents.length - 1 && (
                    <span className="text-white/20">
                      {state.plan?.order === 'sequential' ? '→' : '∥'}
                    </span>
                  )}
                </div>
              );
            })}
            <span className="text-white/20 text-lg">→</span>
            <div className={`flex items-center gap-1.5 rounded-lg px-3 py-2 border transition-all ${
              state.status === 'complete' ? 'bg-green-400/10 border-green-400/20' :
              state.status === 'synthesizing' ? 'bg-purple-400/10 border-purple-400/20' :
              'bg-white/5 border-transparent'
            }`}>
              <span className="text-sm">👑</span>
              <span className="text-[12px] text-white/70 font-medium">Marcus</span>
              <span className="text-[10px] text-white/30 ml-1">SYNTHESIS</span>
              {state.status === 'complete' && <span className="text-green-400 text-[10px] ml-1">✓</span>}
              {state.status === 'synthesizing' && <span className="text-purple-400 text-[10px] ml-1 animate-pulse">●</span>}
            </div>
          </div>
        </div>
      )}

      {/* Plan History ─────────────────────────────────────────────────────── */}
      <div className="mt-6">
        <button
          onClick={handleHistoryToggle}
          className="flex items-center gap-3 w-full glass-card rounded-2xl px-5 py-4 border border-white/5 hover:border-white/10 transition-colors text-left"
        >
          <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase flex-1">
            Plan History
            {history.length > 0 && (
              <span className="ml-2 text-white/20">({history.length})</span>
            )}
          </span>
          {historyLoading && <span className="w-3 h-3 rounded-full border border-white/20 border-t-white/60 animate-spin" />}
          <span className="text-white/30 text-sm">{historyOpen ? '▲' : '▼'}</span>
        </button>

        {historyOpen && (
          <div className="mt-2 space-y-2">
            {history.length === 0 && !historyLoading && (
              <div className="glass-card rounded-xl p-5 border border-white/5 text-center">
                <p className="text-[12px] text-white/20">No plans saved yet. Send a request to create your first.</p>
              </div>
            )}
            {history.map(plan => (
              <div key={plan.id} className="glass-card rounded-xl border border-white/5 overflow-hidden">
                {/* Plan row */}
                <button
                  onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors text-left"
                >
                  {/* Status dot */}
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    plan.status === 'complete' ? 'bg-green-400' :
                    plan.status === 'partial'  ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />

                  {/* Prompt */}
                  <p className="flex-1 text-[13px] text-white/70 truncate">{plan.userPrompt}</p>

                  {/* Agents used */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {plan.agentsUsed.map(id => (
                      <span key={id} className="text-sm" title={AGENT_META[id]?.name ?? id}>
                        {AGENT_META[id]?.icon ?? '?'}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <span className="text-[11px] text-white/25 flex-shrink-0 tabular-nums">
                    {formatElapsed(plan.elapsedMs)}
                  </span>
                  <span className="text-[11px] text-white/25 flex-shrink-0">
                    {formatDate(plan.createdAt)}
                  </span>
                  <span className="text-white/20 text-xs ml-1">{expandedPlan === plan.id ? '▲' : '▼'}</span>
                </button>

                {/* Expanded detail */}
                {expandedPlan === plan.id && (
                  <div className="border-t border-white/5 px-5 py-4 space-y-4">
                    {/* Objective + DoD */}
                    {plan.objective && (
                      <div>
                        <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase mb-1">Objective</p>
                        <p className="text-[13px] text-white/70">{plan.objective}</p>
                      </div>
                    )}
                    {plan.definitionDone && (
                      <div>
                        <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase mb-1">Definition of Done</p>
                        <p className="text-[12px] text-white/50">{plan.definitionDone}</p>
                      </div>
                    )}

                    {/* Agent steps */}
                    {plan.steps.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase mb-2">Agent Outputs</p>
                        <div className="space-y-3">
                          {plan.steps.map(step => {
                            const meta = AGENT_META[step.agentId];
                            return (
                              <div key={step.id} className="bg-white/3 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span>{meta?.icon ?? '?'}</span>
                                  <span className="text-[12px] font-semibold text-white/70">{meta?.name ?? step.agentId}</span>
                                  <span className={`text-[9px] font-bold tracking-wider uppercase ml-auto ${
                                    step.status === 'complete' ? 'text-green-400' :
                                    step.status === 'error'    ? 'text-red-400' : 'text-yellow-400'
                                  }`}>{step.status}</span>
                                </div>
                                {step.taskBrief && (
                                  <p className="text-[11px] text-white/35 mb-2 italic">{step.taskBrief}</p>
                                )}
                                {step.outputContent && (
                                  <p className="text-[12px] text-white/55 leading-relaxed line-clamp-4">
                                    {step.outputContent}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Marcus synthesis */}
                    {plan.synthesis && (
                      <div>
                        <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase mb-2">Marcus Synthesis (Specialist Outputs)</p>
                        <p className="text-[12px] text-white/45 leading-relaxed line-clamp-6">{plan.synthesis}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
