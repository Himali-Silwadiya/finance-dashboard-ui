import { Bell, Search, Menu } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  return (
    <header className="h-20 border-b border-border bg-canvas/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="relative w-64 lg:w-96 hidden md:block">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search transactions, bills..." 
            className="input-base pl-11"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6 ml-auto">
        <button className="relative p-2 text-text-secondary hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-canvas" />
        </button>
        
        <ProfileDropdown />
      </div>
    </header>
  );
};
