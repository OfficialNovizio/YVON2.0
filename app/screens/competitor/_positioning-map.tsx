'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'

export interface CompetitorPoint {
  name: string
  followers: number
  engagementRate: number
  contentVelocity: number
  tier: 'benchmark' | 'stretch' | 'anchor'
  isTrending: boolean
}

interface Props {
  data: CompetitorPoint[]
  style?: React.CSSProperties
}

type Metric = 'engagement' | 'followers' | 'velocity' | 'score'

function computeScore(d: CompetitorPoint): number {
  return Math.round(
    Math.min(d.engagementRate * 1000, 40) +
    Math.min(d.contentVelocity * 4, 20) +
    Math.min(Math.log10(Math.max(d.followers, 1)) * 2, 10) + 10
  )
}

const METRIC_CONFIG: Record<Metric, {
  label: string
  icon: string
  getValue: (d: CompetitorPoint) => number
  fmt: (v: number) => string
}> = {
  engagement: {
    label: 'Eng. Rate',
    icon: 'favorite',
    getValue: d => d.engagementRate * 100,
    fmt: v => v.toFixed(2) + '%',
  },
  followers: {
    label: 'Followers',
    icon: 'group',
    getValue: d => d.followers,
    fmt: v => v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + 'M' : v >= 1_000 ? Math.round(v / 1_000) + 'K' : String(Math.round(v)),
  },
  velocity: {
    label: 'Posts/Week',
    icon: 'calendar_month',
    getValue: d => d.contentVelocity,
    fmt: v => v.toFixed(1) + '/wk',
  },
  score: {
    label: 'Score',
    icon: 'star',
    getValue: computeScore,
    fmt: v => Math.round(v).toString(),
  },
}

const TIER_COLOR: Record<CompetitorPoint['tier'], string> = {
  benchmark: '#2563eb',
  stretch:   '#f59e0b',
  anchor:    '#fbbf24',
}

const TIER_GLOW: Record<CompetitorPoint['tier'], string> = {
  benchmark: 'rgba(37,99,235,0.18)',
  stretch:   'rgba(245,158,11,0.15)',
  anchor:    'rgba(251,191,36,0.13)',
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
    <span style={{ color: 'rgba(241,245,251,0.45)' }}>{label}</span>
    <span style={{ fontWeight: 600, color: '#f4f8ff' }}>{value}</span>
  </div>
)

export default function PositioningMap({ data, style }: Props) {
  const [metric, setMetric] = useState<Metric>('engagement')
  const cfg = METRIC_CONFIG[metric]

  const chartData = useMemo(() => (
    [...data]
      .map(d => ({
        ...d,
        value: cfg.getValue(d),
        displayLabel: cfg.fmt(cfg.getValue(d)),
        color: TIER_COLOR[d.tier],
        glow:  TIER_GLOW[d.tier],
      }))
      .sort((a, b) => b.value - a.value)
  ), [data, metric]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!data.length) {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
        No competitor data yet. Add competitors in Settings.
      </div>
    )
  }

  const BAR_H = Math.max(38, Math.min(58, 380 / chartData.length))
  const chartH = Math.max(200, chartData.length * BAR_H + 24)

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[0] }> }) => {
    if (!active || !payload?.length) return null
    const d = payload[0]?.payload
    if (!d) return null
    return (
      <div style={{
        background: 'rgba(8,14,28,0.97)', backdropFilter: 'blur(16px)',
        borderRadius: 12, padding: '14px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.12)', fontSize: 12, color: '#f4f8ff',
        minWidth: 190, fontFamily: 'system-ui,-apple-system,sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
          <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: '#f4f8ff' }}>{d.name}</p>
          {d.isTrending && <span style={{ fontSize: 11 }}>⚡</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Row label="Eng. Rate" value={(d.engagementRate * 100).toFixed(2) + '%'} />
          <Row label="Followers" value={d.followers.toLocaleString()} />
          <Row label="Posts/week" value={d.contentVelocity.toFixed(1)} />
          <Row label="Score" value={computeScore(d).toString()} />
          <Row label="Tier" value={d.tier.charAt(0).toUpperCase() + d.tier.slice(1)} />
        </div>
      </div>
    )
  }

  const CustomYTick = ({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) => {
    if (!payload) return null
    const entry = chartData.find(d => d.name === payload.value)
    const name = payload.value.length > 13 ? payload.value.slice(0, 12) + '…' : payload.value
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-8} y={0} dy={4}
          textAnchor="end"
          fill="rgba(12,44,82,0.70)"
          fontSize={11}
          fontWeight={600}
          fontFamily="system-ui,-apple-system,sans-serif"
        >
          {name}
        </text>
        {entry?.isTrending && (
          <text x={-8} y={0} dy={-8} textAnchor="end" fontSize={9}>⚡</text>
        )}
      </g>
    )
  }

  return (
    <div style={{ ...style, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>

      {/* Metric switcher */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(12,44,82,0.35)', marginRight: 4 }}>Sort by</span>
        {(Object.keys(METRIC_CONFIG) as Metric[]).map(m => {
          const active = metric === m
          return (
            <button
              key={m}
              onClick={() => setMetric(m)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '5px 12px', borderRadius: 20,
                border: `1px solid ${active ? 'rgba(0,102,204,0.30)' : 'rgba(12,44,82,0.12)'}`,
                cursor: 'pointer', fontSize: 10, fontWeight: 700,
                fontFamily: 'system-ui,-apple-system,sans-serif',
                transition: 'all 0.14s',
                background: active ? 'rgba(0,102,204,0.10)' : 'transparent',
                color: active ? '#0066cc' : 'rgba(12,44,82,0.48)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>{METRIC_CONFIG[m].icon}</span>
              {METRIC_CONFIG[m].label}
            </button>
          )
        })}
      </div>

      {/* Bar Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height={chartH}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 72, bottom: 4, left: 96 }}
            barSize={Math.max(16, BAR_H - 14)}
          >
            <XAxis
              type="number"
              dataKey="value"
              tick={{ fontSize: 9, fill: 'rgba(12,44,82,0.35)', fontWeight: 500 }}
              tickFormatter={cfg.fmt}
              axisLine={{ stroke: 'rgba(12,44,82,0.08)' }}
              tickLine={false}
              domain={[0, 'dataMax']}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={<CustomYTick />}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0,102,204,0.04)', radius: 6 }}
            />
            <Bar
              dataKey="value"
              radius={[0, 6, 6, 0]}
              isAnimationActive
              animationDuration={500}
              animationEasing="ease-out"
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  fillOpacity={0.88}
                />
              ))}
              <LabelList
                dataKey="displayLabel"
                position="right"
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  fill: 'rgba(12,44,82,0.55)',
                  fontFamily: 'ui-monospace,"Geist Mono",monospace',
                  letterSpacing: '-0.02em',
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', paddingLeft: 2 }}>
        {(['benchmark', 'stretch', 'anchor'] as const)
          .filter(t => chartData.some(d => d.tier === t))
          .map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: TIER_COLOR[t], flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(12,44,82,0.40)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t}
              </span>
            </div>
          ))
        }
        {chartData.some(d => d.isTrending) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10 }}>⚡</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(12,44,82,0.40)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trending</span>
          </div>
        )}
        <span style={{ fontSize: 9, color: 'rgba(12,44,82,0.28)', marginLeft: 'auto' }}>
          Sorted by {cfg.label}
        </span>
      </div>
    </div>
  )
}
