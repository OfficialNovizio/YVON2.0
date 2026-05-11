import { Shimmer, ShimmerCard } from '@/app/components/Shimmer';

export default function WarRoomLoading() {
  return (
    <main className="pt-24 px-8 max-w-screen-2xl mx-auto pb-24 h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <Shimmer className="h-2.5 w-16 mb-3" />
          <Shimmer className="h-11 w-48" />
        </div>
        <div className="flex gap-3">
          <Shimmer className="h-9 w-32 rounded-full" />
          <Shimmer className="h-9 w-32 rounded-full" />
        </div>
      </div>

      {/* Agent selector */}
      <div className="flex gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <Shimmer className="w-6 h-6 rounded-full" />
            <Shimmer className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Chat area */}
      <ShimmerCard className="flex-1 flex flex-col min-h-0 mb-4" style={{ minHeight: '400px' }}>
        <div className="flex-1 space-y-6 p-2">
          {/* User message */}
          <div className="flex justify-end">
            <Shimmer className="h-12 w-72 rounded-[18px] rounded-tr-sm" />
          </div>

          {/* Agent response */}
          <div className="flex gap-3">
            <Shimmer className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="space-y-2">
              <Shimmer className="h-4 w-80 rounded-[18px] rounded-tl-sm" />
              <Shimmer className="h-4 w-64 rounded-[18px] rounded-tl-sm" />
              <Shimmer className="h-4 w-48 rounded-[18px] rounded-tl-sm" />
            </div>
          </div>

          {/* Another user message */}
          <div className="flex justify-end">
            <Shimmer className="h-10 w-56 rounded-[18px] rounded-tr-sm" />
          </div>

          {/* Another agent response with typing indicator */}
          <div className="flex gap-3">
            <Shimmer className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="space-y-2">
              <Shimmer className="h-4 w-96 rounded-[18px] rounded-tl-sm" />
              <Shimmer className="h-4 w-72 rounded-[18px] rounded-tl-sm" />
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-white/5 pt-4 flex gap-3">
          <Shimmer className="flex-1 h-12 rounded-[14px]" />
          <Shimmer className="w-12 h-12 rounded-full" />
        </div>
      </ShimmerCard>
    </main>
  );
}
