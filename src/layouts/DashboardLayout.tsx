import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-canvas flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
