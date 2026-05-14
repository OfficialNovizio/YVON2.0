import React from 'react';
import NavBar from '@/app/components/Nav/NavBar';
import VentureGate from '@/app/components/VentureGate';

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ana-font min-h-screen" style={{ background: '#07090f' }}>
      {/* Fixed gradient splashes — shared across all analytics sub-pages */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute -left-32 -top-32 w-[520px] h-[520px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #0066cc 0%, #38bdf8 30%, transparent 65%)',
            filter: 'blur(80px)',
            opacity: 0.28,
          }}
        />
        <div
          className="absolute -right-24 -bottom-24 w-[440px] h-[440px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 60% 60%, #fbbf24 0%, #fcd34d 25%, transparent 62%)',
            filter: 'blur(90px)',
            opacity: 0.11,
          }}
        />
      </div>
      <div className="relative" style={{ zIndex: 1 }}>
        <NavBar />
        <VentureGate screenName="Analytics">{children}</VentureGate>
      </div>
    </div>
  );
}
