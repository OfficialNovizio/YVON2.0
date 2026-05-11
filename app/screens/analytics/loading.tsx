import { Shimmer, ShimmerCard } from '@/app/components/Shimmer';

export default function AnalyticsLoading() {
  return (
    <main className="pt-24 px-8 max-w-screen-2xl mx-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <Shimmer className="h-2.5 w-20 mb-3" />
          <Shimmer className="h-11 w-56" />
        </div>
        <div className="flex gap-3">
          <Shimmer className="h-9 w-28 rounded-full" />
          <Shimmer className="h-9 w-28 rounded-full" />
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerCard key={i} className="space-y-3">
            <Shimmer className="h-2.5 w-20" />
            <Shimmer className="h-9 w-28" />
            <Shimmer className="h-3 w-16" />
          </ShimmerCard>
        ))}
      </div>

      {/* Main chart */}
      <ShimmerCard className="mb-8 h-80">
        <div className="flex justify-between mb-6">
          <Shimmer className="h-3 w-24" />
          <div className="flex gap-3">
            <Shimmer className="h-6 w-16 rounded-full" />
            <Shimmer className="h-6 w-16 rounded-full" />
          </div>
        </div>
        <Shimmer className="h-52 w-full rounded-[10px]" />
      </ShimmerCard>

      {/* Two charts side by side */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <ShimmerCard key={i} className="h-64 space-y-4">
            <Shimmer className="h-3 w-32" />
            <Shimmer className="flex-1 h-44 rounded-[10px]" />
          </ShimmerCard>
        ))}
      </div>

      {/* Table */}
      <ShimmerCard className="overflow-hidden">
        <Shimmer className="h-3 w-24 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-8 py-3 border-b border-white/5">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-4 w-16" />
              <Shimmer className="h-4 w-24 ml-auto" />
            </div>
          ))}
        </div>
      </ShimmerCard>
    </main>
  );
}
