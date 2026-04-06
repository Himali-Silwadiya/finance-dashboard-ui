import { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';
import { useFinanceStore } from '../../store/useFinanceStore';
import { TransactionModal } from './TransactionModal';
import { ShoppingBag, Briefcase, Zap, HelpCircle, Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Edit2, Trash2 } from 'lucide-react';
import type { Transaction } from '../../types';

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': return <ShoppingBag className="w-5 h-5 flex-shrink-0" />;
    case 'salary': return <Briefcase className="w-5 h-5 flex-shrink-0" />;
    case 'utilities': return <Zap className="w-5 h-5 flex-shrink-0" />;
    default: return <HelpCircle className="w-5 h-5 flex-shrink-0" />;
  }
};

type SortField = 'date' | 'amount' | 'title' | 'status';
type SortOrder = 'asc' | 'desc';

export const TransactionTable = () => {
  const { transactions, isLoading, role, updateTransaction, deleteTransaction } = useFinanceStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              tx.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || tx.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        let modifier = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'date') return (new Date(a.date).getTime() - new Date(b.date).getTime()) * modifier;
        if (sortField === 'amount') return (a.amount - b.amount) * modifier;
        if (sortField === 'title') return a.title.localeCompare(b.title) * modifier;
        if (sortField === 'status') return a.status.localeCompare(b.status) * modifier;
        return 0;
      });
  }, [transactions, searchTerm, filterType, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-40 hover:opacity-100" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4 ml-1 text-primary" /> : <ArrowDown className="w-4 h-4 ml-1 text-primary" />;
  };

  return (
    <Card className="col-span-full flex flex-col min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-white">Transactions</h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="input-base pl-9 py-2 text-sm w-full"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-[#1A1A1A] p-1 rounded-lg border border-border w-full sm:w-auto">
             {(['all', 'income', 'expense'] as const).map(type => (
               <button
                 key={type}
                 onClick={() => { setFilterType(type); setCurrentPage(1); }}
                 className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors flex-1 sm:flex-none ${
                   filterType === type ? 'bg-panel text-white shadow-sm border border-white/5' : 'text-text-secondary hover:text-white'
                 }`}
               >
                 {type}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-secondary uppercase border-b border-border">
             <tr>
               <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => handleSort('title')}>
                 <div className="flex items-center">Transaction <SortIcon field="title"/></div>
               </th>
               <th className="px-4 py-3 font-medium">Category</th>
               <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => handleSort('amount')}>
                 <div className="flex items-center">Amount <SortIcon field="amount"/></div>
               </th>
               <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => handleSort('date')}>
                 <div className="flex items-center">Date <SortIcon field="date"/></div>
               </th>
               <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => handleSort('status')}>
                 <div className="flex items-center">Status <SortIcon field="status"/></div>
               </th>
               {role === 'admin' && <th className="px-4 py-3 font-medium text-right">Actions</th>}
             </tr>
          </thead>
          <tbody>
            {isLoading ? (
               Array.from({ length: 8 }).map((_, i) => (
                 <tr key={i} className="border-b border-white/5 last:border-0">
                   <td className="px-4 py-4"><Skeleton className="h-10 w-48" /></td>
                   <td className="px-4 py-4"><Skeleton className="h-6 w-24" /></td>
                   <td className="px-4 py-4"><Skeleton className="h-6 w-20" /></td>
                   <td className="px-4 py-4"><Skeleton className="h-6 w-24" /></td>
                   <td className="px-4 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                   {role === 'admin' && <td className="px-4 py-4"><Skeleton className="h-6 w-12 ml-auto" /></td>}
                 </tr>
               ))
            ) : paginatedTransactions.length === 0 ? (
               <tr>
                 <td colSpan={role === 'admin' ? 6 : 5} className="py-12 text-center text-text-tertiary">
                   No transactions found matching your criteria.
                 </td>
               </tr>
            ) : (
              paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#1A1A1A] group-hover:bg-panel transition-colors text-text-secondary group-hover:text-white border border-transparent group-hover:border-white/10">
                        {getCategoryIcon(tx.category)}
                      </div>
                      <span className="font-medium text-white">{tx.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                     <span className="inline-flex items-center px-2 py-1 rounded bg-[#1A1A1A] text-text-secondary text-xs border border-white/5">
                        {tx.category}
                     </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${tx.type === 'income' ? 'text-success' : 'text-white'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-tertiary whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${
                      tx.status === 'completed' 
                        ? 'bg-success/10 text-success border-success/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingTx(tx); setIsModalOpen(true); }}
                          className="p-1.5 text-text-secondary hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { if(window.confirm('Delete transaction?')) deleteTransaction(tx.id); }}
                          className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
         <p className="text-sm text-text-tertiary hidden sm:block">
            Showing <span className="text-white font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedTransactions.length)}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}</span> of <span className="text-white font-medium">{filteredAndSortedTransactions.length}</span> results
         </p>
         
         <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-1 rounded-md text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-secondary transition-colors"
            >
               <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm text-text-secondary">
               Page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white">{Math.max(1, totalPages)}</span>
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading || totalPages === 0}
              className="p-1 rounded-md text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-secondary transition-colors"
            >
               <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        initialData={editingTx}
        onClose={() => { setIsModalOpen(false); setEditingTx(null); }}
        onSave={(updated) => updateTransaction(editingTx!.id, updated)}
      />
    </Card>
  );
};
