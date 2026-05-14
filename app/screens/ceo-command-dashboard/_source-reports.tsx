'use client'

import { useState, useEffect } from 'react'

interface SourceReportItem {
  id: string
  title: string
  summary: string
  createdAt: string
  reportNumber: number
}

interface SourceReportsData {
  analytics: SourceReportItem | null
  marketing: SourceReportItem | null
  competitor: SourceReportItem | null
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function ReportCard({ label, icon, report, color }: {
  label: string
  icon: string
  report: SourceReportItem | null
  color: string
}) {
  return (
    <div className="bg-black/10 border border-white/5 rounded-[12px] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[16px] ${color}`}>{icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</span>
        </div>
        <span className={`text-[8px] font-bold uppercase tracking-widest ${report ? 'text-emerald-400/60' : 'text-white/15'}`}>
          {report ? timeAgo(report.createdAt) : 'No report'}
        </span>
      </div>
      {report ? (
        <>
          <p className="text-[10px] leading-relaxed text-white/50 line-clamp-3 mb-2">
            {report.summary.slice(0, 200)}
          </p>
          <p className="text-[8px] text-white/15 font-medium">
            Report #{report.reportNumber}
          </p>
        </>
      ) : (
        <p className="text-[10px] text-white/20 italic">Pending first run</p>
      )}
    </div>
  )
}

export default function SourceReports() {
  const [data, setData] = useState<SourceReportsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/intelligence/latest')
      .then((r) => r.json())
      .then((json) => {
        setData((json as { sourceReports?: SourceReportsData }).sourceReports ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <h5 className="text-[11px] font-medium uppercase tracking-widest text-white/40 mb-4">Source Reports</h5>
        <div className="flex items-center justify-center h-20">
          <div className="w-4 h-4 border-2 border-white/10 border-t-[#0066cc] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-[11px] font-medium uppercase tracking-widest text-white/40">Source Reports</h5>
        <span className="text-[8px] text-white/15 font-medium">Feeds intelligence</span>
      </div>
      <div className="space-y-3">
        <ReportCard
          label="Analytics"
          icon="bar_chart"
          report={data?.analytics ?? null}
          color="text-[#0066cc]"
        />
        <ReportCard
          label="Marketing"
          icon="campaign"
          report={data?.marketing ?? null}
          color="text-emerald-400"
        />
        <ReportCard
          label="Competitor"
          icon="radar"
          report={data?.competitor ?? null}
          color="text-violet-400"
        />
      </div>
      {data?.competitor && (
        <div className="mt-3 p-3 bg-amber-400/5 border border-amber-400/10 rounded-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[8px] font-bold text-amber-400/80 uppercase tracking-widest">
              Next intelligence cycle in ~24h
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
