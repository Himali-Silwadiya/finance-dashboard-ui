import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, User as UserIcon, Shield, Repeat, LogIn } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { AuthModal } from '../auth/AuthModal';

export const ProfileDropdown = () => {
  const { isLoggedIn, role, logout } = useFinanceStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleOpenAuth = () => {
    setIsOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Avatar Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 pl-4 md:pl-6 border-l border-border transition-opacity ${isOpen ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-sm">
            <div className="w-full h-full rounded-full border-2 border-canvas overflow-hidden bg-panel flex items-center justify-center">
              {isLoggedIn ? (
                 <img src="https://ui-avatars.com/api/?name=Alex+Doe&background=random" alt="User" className="w-full h-full object-cover" />
              ) : (
                 <UserIcon className="w-5 h-5 text-text-tertiary" />
              )}
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium text-white transition-colors flex items-center gap-1">
               {isLoggedIn ? 'Alex Doe' : 'Guest'}
            </p>
            <p className="text-xs text-text-tertiary capitalize">
               {isLoggedIn ? role : 'Sign In Required'}
            </p>
          </div>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 mt-3 w-56 bg-panel border border-border rounded-xl shadow-2xl py-2 z-50 origin-top-right backdrop-blur-xl"
            >
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/[0.02]">
                    <p className="text-sm font-medium text-white">Alex Doe</p>
                    <p className="text-xs text-text-tertiary capitalize mt-0.5 flex items-center gap-1.5">
                       {role === 'admin' ? <Shield className="w-3 h-3 text-primary" /> : <UserIcon className="w-3 h-3 text-blue-500" />}
                       {role} Account
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleOpenAuth}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Repeat className="w-4 h-4" />
                    Switch Role
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  
                  <div className="h-px bg-border my-1" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/[0.02]">
                    <p className="text-sm font-medium text-white mb-0.5">Welcome</p>
                    <p className="text-xs text-text-tertiary">Sign in to unlock your dashboard metrics.</p>
                  </div>
                  
                  <button 
                    onClick={handleOpenAuth}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-primary" />
                    Sign In
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Auth Modal Portal/Wrapper */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
