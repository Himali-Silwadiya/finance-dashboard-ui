import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Transaction } from '../../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Partial<Transaction>) => void;
  initialData?: Transaction | null;
}

export const TransactionModal = ({ isOpen, onClose, onSave, initialData }: TransactionModalProps) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    title: '',
    amount: 0,
    category: 'Food',
    type: 'expense',
    status: 'completed',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        amount: 0,
        category: 'Food',
        type: 'expense',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-panel border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-border bg-[#1A1A1A]">
          <h3 className="text-white font-semibold text-lg">{initialData ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button onClick={onClose} className="text-text-tertiary hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase mb-1">Title</label>
            <input 
              type="text" 
              required
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="input-base"
              placeholder="e.g., Apple Store"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-medium text-text-secondary uppercase mb-1">Amount</label>
               <input 
                 type="number" 
                 required
                 min="0"
                 step="0.01"
                 value={formData.amount} 
                 onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                 className="input-base"
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-text-secondary uppercase mb-1">Date</label>
               <input 
                 type="date" 
                 required
                 value={formData.date} 
                 onChange={e => setFormData({ ...formData, date: e.target.value })}
                 className="input-base"
               />
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-medium text-text-secondary uppercase mb-1">Type</label>
               <select 
                 value={formData.type} 
                 onChange={e => setFormData({ ...formData, type: e.target.value as 'income'|'expense' })}
                 className="input-base"
               >
                 <option value="expense">Expense</option>
                 <option value="income">Income</option>
               </select>
             </div>
             <div>
               <label className="block text-xs font-medium text-text-secondary uppercase mb-1">Status</label>
               <select 
                 value={formData.status} 
                 onChange={e => setFormData({ ...formData, status: e.target.value as 'completed'|'pending' })}
                 className="input-base"
               >
                 <option value="completed">Completed</option>
                 <option value="pending">Pending</option>
               </select>
             </div>
          </div>
          
          <div>
             <label className="block text-xs font-medium text-text-secondary uppercase mb-1">Category</label>
             <select 
               value={formData.category} 
               onChange={e => setFormData({ ...formData, category: e.target.value })}
               className="input-base"
             >
               <option value="Food">Food</option>
               <option value="Salary">Salary</option>
               <option value="Subscriptions">Subscriptions</option>
               <option value="Utilities">Utilities</option>
               <option value="Shopping">Shopping</option>
               <option value="Transport">Transport</option>
             </select>
          </div>

          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-white hover:bg-white/5 transition-colors font-medium">Cancel</button>
             <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors font-medium">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};
