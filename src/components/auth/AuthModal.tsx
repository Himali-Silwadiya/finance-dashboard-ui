import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, User as UserIcon } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login } = useFinanceStore();

  const handleLogin = (selectedRole: 'viewer' | 'admin') => {
    login(selectedRole);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-panel rounded-2xl border border-border shadow-2xl overflow-hidden p-6"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-text-tertiary hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8 mt-2">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-sm text-text-secondary">Please select an account role to continue into the dashboard.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => handleLogin('viewer')}
                className="group relative w-full flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-white/5 bg-[#1A1A1A] hover:bg-white/5 hover:border-white/10 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-medium mb-1">Continue as Viewer</h3>
                  <p className="text-xs text-text-tertiary">Read-only access to all tracking metrics and insights.</p>
                </div>
              </button>

              <button 
                onClick={() => handleLogin('admin')}
                className="group relative w-full flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform relative z-10">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="text-white font-medium mb-1">Continue as Admin</h3>
                  <p className="text-xs text-text-tertiary">Full CRUD permissions modifying and downloading ledger records.</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
