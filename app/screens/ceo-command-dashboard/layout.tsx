import React from 'react';
import NavBar from '@/app/components/Nav/NavBar';

export default function CEOCommandDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <NavBar />
      {children}
    </div>
  );
}
