import { Bell, Search, Shield, User } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';

export const Topbar = () => {
  const { role, setRole } = useFinanceStore();

  return (
    <header className="h-20 border-b border-border bg-canvas/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
      <div className="relative w-96 hidden md:block">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input 
          type="text" 
          placeholder="Search transactions, bills..." 
          className="input-base pl-11"
        />
      </div>

      <div className="flex items-center gap-6 ml-auto">
        {/* Role Toggle */}
        <div className="hidden sm:flex items-center bg-[#1A1A1A] rounded-lg p-1 border border-border">
           <button 
             onClick={() => setRole('viewer')}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${role === 'viewer' ? 'bg-panel text-white shadow-sm border border-white/5' : 'text-text-secondary hover:text-white'}`}
           >
             <User className="w-3 h-3" /> Viewer
           </button>
           <button 
             onClick={() => setRole('admin')}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${role === 'admin' ? 'bg-primary/20 text-primary border border-primary/20' : 'text-text-secondary hover:text-white'}`}
           >
             <Shield className="w-3 h-3" /> Admin
           </button>
        </div>

        <button className="relative p-2 text-text-secondary hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-canvas" />
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-border cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5">
            <div className="w-full h-full rounded-full border-2 border-canvas overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Alex+Doe&background=random" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">Alex Doe</p>
            <p className="text-xs text-text-tertiary">Pro Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
};
