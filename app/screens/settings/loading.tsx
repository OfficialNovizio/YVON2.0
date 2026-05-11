import { Shimmer, ShimmerCard } from '@/app/components/Shimmer';

export default function SettingsLoading() {
  return (
    <main className="pt-24 px-8 max-w-screen-2xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-12">
        <Shimmer className="h-2.5 w-20 mb-3" />
        <Shimmer className="h-11 w-40" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar nav */}
        <div className="col-span-3 space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-10 w-full rounded-[10px]" />
          ))}
        </div>

        {/* Settings content */}
        <div className="col-span-9 space-y-6">
          {/* Section */}
          <ShimmerCard className="space-y-6">
            <Shimmer className="h-5 w-32" />
            <div className="grid grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Shimmer className="h-3 w-24" />
                  <Shimmer className="h-11 w-full rounded-[12px]" />
                </div>
              ))}
            </div>
            <Shimmer className="h-px w-full" />
            <div className="space-y-2">
              <Shimmer className="h-3 w-28" />
              <Shimmer className="h-28 w-full rounded-[12px]" />
            </div>
            <div className="flex justify-end">
              <Shimmer className="h-10 w-28 rounded-full" />
            </div>
          </ShimmerCard>

          {/* Agents section */}
          <ShimmerCard className="space-y-4">
            <Shimmer className="h-5 w-28" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5">
                <Shimmer className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Shimmer className="h-4 w-32" />
                  <Shimmer className="h-3 w-48" />
                </div>
                <Shimmer className="h-9 w-24 rounded-full" />
              </div>
            ))}
          </ShimmerCard>

          {/* Danger zone */}
          <ShimmerCard className="space-y-4 border-red-500/20">
            <Shimmer className="h-5 w-24" />
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="h-10 w-36 rounded-full" />
          </ShimmerCard>
        </div>
      </div>
    </main>
  );
}
