'use client'

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Cell, Label, ReferenceLine, ResponsiveContainer } from 'recharts'

interface CompetitorPoint {
  name: string
  initial: string
  followers: number
  engagementRate: number  // decimal, e.g. 0.034 = 3.4%
  contentVelocity: number  // posts per week
  tier: 'benchmark' | 'stretch' | 'anchor'
  isTrending: boolean
}

interface QuadrantChartProps {
  data: CompetitorPoint[]
  style?: React.CSSProperties
}

export default function QuadrantChart({ data, style }: QuadrantChartProps) {
  if (!data.length) {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(244,248,255,0.45)', fontSize: 12 }}>
        No competitor data yet. Add competitors in Settings.
      </div>
    )
  }

  // Compute medians for quadrant lines
  const sortedByFollowers = [...data].sort((a, b) => a.followers - b.followers)
  const sortedByER = [...data].sort((a, b) => a.engagementRate - b.engagementRate)
  const medianFollowers = sortedByFollowers[Math.floor(sortedByFollowers.length / 2)].followers
  const medianER = sortedByER[Math.floor(sortedByER.length / 2)].engagementRate

  // Log-scale followers for X axis
  const chartData = data.map(d => ({
    ...d,
    x: Math.log10(Math.max(d.followers, 1)),
    y: d.engagementRate * 100, // convert to percentage for display
    z: Math.max(d.contentVelocity * 5, 20), // min bubble size
  }))

  const medianX = Math.log10(Math.max(medianFollowers, 1))
  const medianY = medianER * 100

  const tierColors: Record<string, string> = {
    benchmark: '#0066cc',
    stretch: '#fbbf24',
    anchor: 'rgba(251,191,36,0.40)',
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0]?.payload as typeof chartData[0]
    if (!d) return null
    return (
      <div style={{
        background: 'rgba(15,22,38,0.95)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
        padding: '10px 14px', fontSize: 11, color: '#f4f8ff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <p style={{ fontWeight: 700, fontSize: 12, margin: '0 0 4px' }}>{d.name}</p>
        <p style={{ margin: 0 }}>{(d.engagementRate * 100).toFixed(2)}% engagement</p>
        <p style={{ margin: 0 }}>{d.followers.toLocaleString()} followers</p>
        <p style={{ margin: 0 }}>{d.contentVelocity} posts/week</p>
      </div>
    )
  }

  return (
    <div style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 30 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <XAxis
            type="number"
            dataKey="x"
            name="Followers"
            tick={{ fontSize: 9, fill: 'rgba(244,248,255,0.45)' }}
            tickFormatter={(v: number) => {
              const f = Math.pow(10, v)
              if (f >= 1_000_000) return (f / 1_000_000).toFixed(1) + 'M'
              if (f >= 1_000) return Math.round(f / 1_000) + 'K'
              return String(Math.round(f))
            }}
            domain={['dataMin - 0.2', 'dataMax + 0.2']}
          >
            <Label value="Followers →" offset={-8} position="insideBottom" style={{ fontSize: 9, fill: 'rgba(244,248,255,0.35)' }} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            name="Engagement Rate"
            tick={{ fontSize: 9, fill: 'rgba(244,248,255,0.45)' }}
            tickFormatter={(v: number) => v.toFixed(1) + '%'}
            domain={['dataMin - 0.5', 'dataMax + 0.5']}
          >
            <Label value="Engagement →" angle={-90} offset={-2} position="insideLeft" style={{ fontSize: 9, fill: 'rgba(244,248,255,0.35)' }} />
          </YAxis>
          <ZAxis type="number" dataKey="z" range={[20, 80]} />

          {/* Quadrant reference lines */}
          {data.length > 1 && (
            <>
              <ReferenceLine x={medianX} stroke="rgba(255,255,255,0.12)" strokeDasharray="6 3" />
              <ReferenceLine y={medianY} stroke="rgba(255,255,255,0.12)" strokeDasharray="6 3" />
            </>
          )}

          <Scatter data={chartData}>
            {chartData.map((d, i) => (
              <Cell
                key={d.name}
                fill={d.isTrending ? '#fbbf24' : tierColors[d.tier] ?? '#0066cc'}
                fillOpacity={d.tier === 'anchor' ? 0.3 : d.isTrending ? 0.9 : 0.75}
                stroke={d.isTrending ? '#fbbf24' : tierColors[d.tier] ?? '#0066cc'}
                strokeOpacity={d.isTrending ? 0.8 : 0.3}
                strokeWidth={d.isTrending ? 2 : 1}
              />
            ))}
          </Scatter>

          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Quadrant labels */}
      {data.length > 1 && (
        <>
          <span style={{
            position: 'absolute', top: '12%', right: '10%',
            fontSize: 9, color: 'rgba(34,211,238,0.5)', fontWeight: 600,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>Leaders</span>
          <span style={{
            position: 'absolute', top: '12%', left: '12%',
            fontSize: 9, color: 'rgba(251,191,36,0.5)', fontWeight: 600,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>Niche Threats</span>
          <span style={{
            position: 'absolute', bottom: '14%', right: '10%',
            fontSize: 9, color: 'rgba(148,163,184,0.35)', fontWeight: 600,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>Sleepers</span>
          <span style={{
            position: 'absolute', bottom: '14%', left: '12%',
            fontSize: 9, color: 'rgba(148,163,184,0.25)', fontWeight: 600,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>Irrelevant</span>
        </>
      )}
    </div>
  )
}
