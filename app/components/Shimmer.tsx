import type React from 'react';

interface ShimmerProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Shimmer({ className = '', style }: ShimmerProps) {
  return (
    <div className={`rounded bg-white/[0.06] shimmer ${className}`} style={style} />
  );
}

export function ShimmerCard({ className = '', style, children }: { className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return (
    <div className={`rounded-[18px] bg-white/[0.04] border border-white/[0.06] p-6 ${className}`} style={style}>
      {children}
    </div>
  );
}
