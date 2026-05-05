import React from 'react';
import NavBar from '@/app/components/Nav/NavBar';

export default function AnalyticsPortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      {children}
    </div>
  );
}
