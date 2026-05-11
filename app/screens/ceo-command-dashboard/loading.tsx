import { Shimmer, ShimmerCard } from '@/app/components/Shimmer';

export default function CEODashboardLoading() {
  return (
    <>
      {/* Anomalies strip skeleton */}
      <div className="fixed top-14 w-full z-40 bg-[#1a1a1c] border-b border-white/5 h-9 flex items-center px-8 gap-4">
        <Shimmer className="h-3 w-20 flex-shrink-0" />
        <Shimmer className="h-3 w-64" />
      </div>

      <main className="pt-32 px-8 max-w-screen-2xl mx-auto pb-24">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <Shimmer className="h-2.5 w-24 mb-3" />
            <Shimmer className="h-11 w-72" />
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <Shimmer className="h-3 w-36" />
            <Shimmer className="h-3 w-28" />
          </div>
        </div>

        {/* Hero */}
        <ShimmerCard className="min-h-[420px] mb-8">
          <div className="max-w-xl space-y-4 pt-6">
            <Shimmer className="h-14 w-96" />
            <Shimmer className="h-5 w-80" />
            <div className="flex gap-4 pt-4">
              <Shimmer className="h-9 w-32 rounded-full" />
              <Shimmer className="h-9 w-28 rounded-full" />
              <Shimmer className="h-9 w-28 rounded-full" />
            </div>
            <Shimmer className="h-12 w-48 rounded-full mt-4" />
          </div>
        </ShimmerCard>

        {/* Premium briefing + competitor edge */}
        <div className="grid grid-cols-12 gap-8 mb-8">
          <ShimmerCard className="col-span-8 flex gap-8">
            <Shimmer className="w-16 h-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3 pt-2">
              <Shimmer className="h-3 w-32" />
              <Shimmer className="h-7 w-full" />
              <Shimmer className="h-7 w-4/5" />
              <Shimmer className="h-7 w-3/5" />
              <div className="flex gap-3 pt-2">
                <Shimmer className="h-7 w-28 rounded-full" />
                <Shimmer className="h-5 w-40" />
              </div>
            </div>
          </ShimmerCard>
          <ShimmerCard className="col-span-4 space-y-4">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-5 w-full" />
            <Shimmer className="h-5 w-4/5" />
            <Shimmer className="h-5 w-3/5" />
            <Shimmer className="h-4 w-32 mt-4" />
          </ShimmerCard>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShimmerCard key={i} className="space-y-3">
              <Shimmer className="h-2.5 w-12" />
              <Shimmer className="h-8 w-20" />
              <Shimmer className="h-3 w-16" />
            </ShimmerCard>
          ))}
        </div>

        {/* Signal panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <ShimmerCard key={i} className="space-y-5">
              <Shimmer className="h-2.5 w-20 mb-4" />
              {Array.from({ length: 4 }).map((__, j) => (
                <div key={j} className="flex gap-3 items-start">
                  <Shimmer className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" />
                  <Shimmer className="h-4 flex-1" />
                </div>
              ))}
            </ShimmerCard>
          ))}
        </div>

        {/* Decision queue + brand pulse */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          <ShimmerCard className="col-span-5 space-y-4">
            <Shimmer className="h-2.5 w-28 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-[11px] bg-white/[0.03] border border-white/5 p-4 space-y-3">
                <Shimmer className="h-3 w-16" />
                <Shimmer className="h-5 w-full" />
                <div className="grid grid-cols-2 gap-3">
                  <Shimmer className="h-9 rounded-full" />
                  <Shimmer className="h-9 rounded-full" />
                </div>
              </div>
            ))}
          </ShimmerCard>

          <ShimmerCard className="col-span-7 flex flex-col">
            <div className="flex justify-between mb-8">
              <Shimmer className="h-2.5 w-20" />
              <div className="flex gap-4">
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-4 w-24" />
              </div>
            </div>
            <Shimmer className="flex-1 h-64 rounded-[10px]" />
          </ShimmerCard>
        </div>

        {/* Executive priorities */}
        <div className="mb-16">
          <Shimmer className="h-2.5 w-36 mb-8" />
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ShimmerCard key={i} className="space-y-4">
                <div className="flex justify-between">
                  <Shimmer className="h-6 w-24 rounded" />
                  <Shimmer className="h-4 w-12" />
                </div>
                <Shimmer className="h-5 w-4/5" />
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-3/4" />
                <Shimmer className="h-3 w-24 mt-2" />
              </ShimmerCard>
            ))}
          </div>
        </div>

        {/* Performance breakdown */}
        <div className="mb-16">
          <Shimmer className="h-2.5 w-40 mb-8" />
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShimmerCard key={i} className="space-y-3">
                <Shimmer className="h-2.5 w-28" />
                <div className="flex items-baseline gap-2">
                  <Shimmer className="h-8 w-20" />
                  <Shimmer className="h-3 w-12" />
                </div>
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-3/4" />
              </ShimmerCard>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
