import { Shimmer, ShimmerCard } from '@/app/components/Shimmer';

export default function CompetitorLoading() {
  return (
    <main className="pt-24 px-8 max-w-screen-2xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-12">
        <Shimmer className="h-2.5 w-24 mb-3" />
        <Shimmer className="h-11 w-64" />
      </div>

      {/* Competitor cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <ShimmerCard key={i} className="space-y-4">
            <div className="flex items-center gap-3">
              <Shimmer className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5">
                <Shimmer className="h-4 w-28" />
                <Shimmer className="h-3 w-20" />
              </div>
            </div>
            <Shimmer className="h-px w-full bg-white/5" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Shimmer className="h-3 w-20" />
                <Shimmer className="h-3 w-12" />
              </div>
              <div className="flex justify-between">
                <Shimmer className="h-3 w-24" />
                <Shimmer className="h-3 w-16" />
              </div>
              <div className="flex justify-between">
                <Shimmer className="h-3 w-16" />
                <Shimmer className="h-3 w-14" />
              </div>
            </div>
            <Shimmer className="h-9 w-full rounded-full mt-2" />
          </ShimmerCard>
        ))}
      </div>

      {/* Content intel */}
      <div className="mb-8">
        <Shimmer className="h-2.5 w-28 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ShimmerCard key={i} className="flex gap-4">
              <Shimmer className="w-16 h-16 rounded-[10px] flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4 w-3/4" />
                <Shimmer className="h-3 w-full" />
                <Shimmer className="h-3 w-2/3" />
                <div className="flex gap-2 mt-1">
                  <Shimmer className="h-5 w-16 rounded-full" />
                  <Shimmer className="h-5 w-12 rounded-full" />
                </div>
              </div>
            </ShimmerCard>
          ))}
        </div>
      </div>

      {/* Gap analysis */}
      <ShimmerCard className="space-y-4">
        <Shimmer className="h-3 w-24 mb-2" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Shimmer className="h-4 w-40" />
            <div className="flex-1 h-2 rounded-full bg-white/5">
              <Shimmer className="h-2 rounded-full" style={{ width: `${30 + i * 15}%` }} />
            </div>
            <Shimmer className="h-4 w-10" />
          </div>
        ))}
      </ShimmerCard>
    </main>
  );
}
