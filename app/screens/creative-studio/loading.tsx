import { Shimmer, ShimmerCard } from '@/app/components/Shimmer';

export default function CreativeStudioLoading() {
  return (
    <main className="pt-24 px-8 max-w-screen-2xl mx-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <Shimmer className="h-2.5 w-28 mb-3" />
          <Shimmer className="h-11 w-64" />
        </div>
        <Shimmer className="h-11 w-40 rounded-full" />
      </div>

      {/* Platform tabs */}
      <div className="flex gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <ShimmerCard key={i} className="space-y-4">
            {/* Content thumbnail */}
            <Shimmer className="h-40 w-full rounded-[12px]" />
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <Shimmer className="h-4 w-3/4" />
                <Shimmer className="h-5 w-16 rounded-full" />
              </div>
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-4/5" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                <Shimmer className="h-5 w-16 rounded" />
                <Shimmer className="h-5 w-16 rounded" />
              </div>
              <Shimmer className="h-8 w-24 rounded-full" />
            </div>
          </ShimmerCard>
        ))}
      </div>

      {/* Brief generator panel */}
      <div className="grid grid-cols-12 gap-8">
        <ShimmerCard className="col-span-8 space-y-4">
          <Shimmer className="h-3 w-32 mb-2" />
          <Shimmer className="h-28 w-full rounded-[12px]" />
          <div className="flex gap-3">
            <Shimmer className="h-10 flex-1 rounded-[12px]" />
            <Shimmer className="h-10 w-32 rounded-full" />
          </div>
        </ShimmerCard>
        <ShimmerCard className="col-span-4 space-y-4">
          <Shimmer className="h-3 w-24 mb-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </ShimmerCard>
      </div>
    </main>
  );
}
