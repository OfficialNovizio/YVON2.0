import React from 'react';
import NavBar from '@/app/components/Nav/NavBar';

export default function CompetitorContentGapsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      {children}
    </div>
  );
}
