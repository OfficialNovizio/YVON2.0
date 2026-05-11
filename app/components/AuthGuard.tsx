'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase-client';
import { Shimmer } from './Shimmer';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'authenticated'>('checking');

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        setStatus('authenticated');
      }
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (status === 'checking') {
    return <AuthCheckShimmer />;
  }

  return <>{children}</>;
}

function AuthCheckShimmer() {
  return (
    <div className="min-h-screen bg-black">
      {/* NavBar skeleton */}
      <div className="fixed top-0 w-full z-50 bg-black/80 border-b border-white/10 h-14 flex items-center px-8">
        <Shimmer className="h-5 w-16" />
        <div className="flex gap-8 ml-12">
          {[80, 64, 80, 96, 72].map((w, i) => (
            <Shimmer key={i} className={`h-3.5 w-${w > 80 ? 24 : w > 70 ? 20 : 16}`} />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Shimmer className="h-8 w-24 rounded-full" />
          <Shimmer className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="pt-32 px-8 max-w-screen-2xl mx-auto pb-24">
        <div className="mb-12">
          <Shimmer className="h-3 w-28 mb-3" />
          <Shimmer className="h-12 w-80" />
        </div>

        {/* Hero */}
        <Shimmer className="h-[420px] w-full rounded-[18px] mb-8" />

        {/* Row */}
        <div className="grid grid-cols-12 gap-8 mb-8">
          <Shimmer className="col-span-8 h-48 rounded-[18px]" />
          <Shimmer className="col-span-4 h-48 rounded-[18px]" />
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-6 gap-4 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-28 rounded-[18px]" />
          ))}
        </div>

        {/* Signal panels */}
        <div className="grid grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Shimmer key={i} className="h-64 rounded-[18px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
