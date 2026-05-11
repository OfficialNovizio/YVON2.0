'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { VentureConfig } from '@/lib/types';

interface Props {
  children: React.ReactNode;
  screenName: string;
}

export default function VentureGate({ children, screenName }: Props) {
  const [status, setStatus] = useState<'loading' | 'locked' | 'open'>('loading');

  useEffect(() => {
    fetch('/api/ventures')
      .then((r) => r.json())
      .then((data: VentureConfig[] | { error: string }) => {
        const list = Array.isArray(data) ? data : [];
        setStatus(list.length > 0 ? 'open' : 'locked');
      })
      .catch(() => setStatus('locked'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-[#0066cc] animate-spin" />
      </div>
    );
  }

  if (status === 'locked') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-8">
        <div className="text-center max-w-sm">
          {/* Lock icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[32px] text-white/30">lock</span>
          </div>

          <h2 className="text-[22px] font-semibold text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
            {screenName} is locked
          </h2>
          <p className="text-[14px] text-white/40 leading-relaxed mb-8">
            Add at least one venture before accessing this screen. All data, analytics, and agent outputs are venture-specific.
          </p>

          <Link
            href="/screens/settings/venture"
            className="inline-flex items-center gap-2 bg-[#0066cc] hover:bg-[#0071e3] text-white font-semibold text-[14px] px-6 py-3 rounded-full transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Add Your First Venture
          </Link>

          <p className="text-[11px] text-white/20 mt-6 uppercase tracking-widest">
            Settings → Venture Profile
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
