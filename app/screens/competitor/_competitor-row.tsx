'use client'

interface CompetitorRowProps {
  rank: number
  name: string
  tier: 'benchmark' | 'stretch' | 'anchor'
  followers: number
  engagementRate: number
  contentVelocity: number
  score: number
  sentimentUp: boolean | null
}

export default function CompetitorRow({ rank, name, tier, followers, engagementRate, contentVelocity, score, sentimentUp }: CompetitorRowProps) {
  const er = engagementRate
  const v = contentVelocity
  const i = rank - 1
  const isBench = tier === 'benchmark'
  const erColor = er >= 0.01 ? '#059669' : er >= 0.005 ? '#f59e0b' : '#94a3b8'
  const rankBg = i === 0 ? 'rgba(0,102,204,0.04)' : i === 1 ? 'rgba(0,102,204,0.02)' : 'transparent'

  const fmtF = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return Math.round(n / 1_000) + 'K'
    return String(n)
  }

  const scoreColor = score >= 60 ? '#059669' : score >= 30 ? '#f59e0b' : '#94a3b8'
  const scoreBg = score >= 60 ? 'rgba(5,150,105,0.10)' : score >= 30 ? 'rgba(245,158,11,0.10)' : 'rgba(148,163,184,0.06)'
  const scoreBorder = score >= 60 ? 'rgba(5,150,105,0.30)' : score >= 30 ? 'rgba(245,158,11,0.25)' : 'rgba(148,163,184,0.15)'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 12px',
      borderBottom: '1px solid rgba(12,44,82,0.06)',
      background: rankBg, borderRadius: 8,
      transition: 'background 0.12s',
    }}>
      {/* Rank */}
      <span style={{
        width: 26, height: 26, borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, flexShrink: 0,
        background: i === 0 ? '#0066cc' : i === 1 ? '#2563eb' : i === 2 ? 'rgba(37,99,235,0.12)' : 'transparent',
        color: i <= 1 ? '#fff' : i === 2 ? '#2563eb' : 'rgba(12,44,82,0.48)',
      }}>{rank}</span>

      {/* Brand name + tier */}
      <div style={{ width: 100, flexShrink: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0c2c52', margin: 0, letterSpacing: '-0.01em' }}>{name}</p>
        <div style={{ display: 'flex', gap: 3, marginTop: 1 }}>
          {!isBench && (
            <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', padding: '0px 4px', borderRadius: 3, background: 'rgba(0,102,204,0.08)', color: 'rgba(12,44,82,0.48)', border: '1px solid rgba(12,44,82,0.10)' }}>{tier}</span>
          )}
          {i === 0 && (
            <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', padding: '0px 4px', borderRadius: 3, background: 'rgba(5,150,105,0.10)', color: '#059669', border: '1px solid rgba(5,150,105,0.25)' }}>Top</span>
          )}
        </div>
      </div>

      {/* Followers */}
      <div style={{ width: 60, textAlign: 'center', flexShrink: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: '#0c2c52', margin: 0, fontFamily: 'ui-monospace,"Geist Mono",monospace', letterSpacing: '-0.03em' }}>
          {followers > 0 ? fmtF(followers) : '—'}
        </p>
        <p style={{ fontSize: 8, fontWeight: 600, color: 'rgba(12,44,82,0.48)', margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Follow</p>
      </div>

      {/* Engagement */}
      <div style={{ width: 60, textAlign: 'center', flexShrink: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: erColor, margin: 0, fontFamily: 'ui-monospace,"Geist Mono",monospace', letterSpacing: '-0.03em' }}>
          {er > 0 ? (er * 100).toFixed(1) + '%' : '—'}
        </p>
        <p style={{ fontSize: 8, fontWeight: 600, color: 'rgba(12,44,82,0.48)', margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Eng Rate</p>
      </div>

      {/* Velocity */}
      <div style={{ width: 50, textAlign: 'center', flexShrink: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: '#0c2c52', margin: 0, fontFamily: 'ui-monospace,"Geist Mono",monospace', letterSpacing: '-0.03em' }}>
          {v > 0 ? v.toFixed(1) : '—'}
        </p>
        <p style={{ fontSize: 8, fontWeight: 600, color: 'rgba(12,44,82,0.48)', margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>/week</p>
      </div>

      {/* Score pill */}
      <div style={{ flexShrink: 0, textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: scoreBg, border: `2px solid ${scoreBorder}`,
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor, fontFamily: 'ui-monospace,monospace' }}>{score}</span>
        </div>
        <p style={{ fontSize: 7, fontWeight: 700, color: 'rgba(12,44,82,0.48)', margin: '2px 0 0', textTransform: 'uppercase' }}>Score</p>
      </div>

      {/* Momentum */}
      <span className="material-symbols-outlined" style={{
        fontSize: 18, flexShrink: 0,
        color: sentimentUp === true ? '#059669' : sentimentUp === false ? '#ef4444' : 'rgba(12,44,82,0.48)',
      }}>
        {sentimentUp === true ? 'trending_up' : sentimentUp === false ? 'trending_down' : 'remove'}
      </span>
    </div>
  )
}
