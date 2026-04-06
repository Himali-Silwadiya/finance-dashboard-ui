import React from 'react';
import { LayoutDashboard, Wallet, PieChart, Settings, LogOut } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Wallet, label: 'Transactions', active: false },
  { icon: PieChart, label: 'Insights', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-border bg-canvas hidden md:flex flex-col">
      <div className="h-20 flex items-center px-8 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">F</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">FinDash</span>
        </div>
      </div>
      
      <div className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-text-secondary hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
