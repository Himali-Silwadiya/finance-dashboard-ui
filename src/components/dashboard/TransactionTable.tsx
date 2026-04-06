import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { useFinanceStore } from '../../store/useFinanceStore';
import { TransactionModal } from './TransactionModal';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Edit2, Trash2, Filter, AlertCircle } from 'lucide-react';
import type { Transaction } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrency, formatDateSegment } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/icons';

type SortField = 'date' | 'amount' | 'title' | 'status';
type SortOrder = 'asc' | 'desc';

export const TransactionTable = () => {
  const { transactions, isLoading, role, updateTransaction, deleteTransaction } = useFinanceStore();
  
  // States
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Date Range
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive unique categories from transactions for the filter dropdown
  const uniqueCategories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return ['all', ...Array.from(cats)].sort();
  }, [transactions]);

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
        // Search
        const matchesSearch = tx.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                              tx.category.toLowerCase().includes(debouncedSearch.toLowerCase());
        
        // Type filter
        const matchesType = filterType === 'all' || tx.type === filterType;
        
        // Category filter
        const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
        
        // Date Range
        const txDate = new Date(tx.date).getTime();
        const start = startDate ? new Date(startDate).getTime() : 0;
        // Adjust end date to cover the entire day selected
        const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity; 
        const matchesDate = txDate >= start && txDate <= end;

        return matchesSearch && matchesType && matchesCategory && matchesDate;
      })
      .sort((a, b) => {
        let modifier = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'date') return (new Date(a.date).getTime() - new Date(b.date).getTime()) * modifier;
        if (sortField === 'amount') return (a.amount - b.amount) * modifier;
        if (sortField === 'title') return a.title.localeCompare(b.title) * modifier;
        if (sortField === 'status') return a.status.localeCompare(b.status) * modifier;
        return 0;
      });
  }, [transactions, debouncedSearch, filterType, filterCategory, startDate, endDate, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  
  // Reset pagination if filtered payload is smaller than current page
  useEffect(() => {
    if (currentPage > Math.max(1, totalPages)) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-40 hover:opacity-100 transition-opacity" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4 ml-1 text-primary" /> : <ArrowDown className="w-4 h-4 ml-1 text-primary" />;
  };

  // Determine an artificial "Large Transaction" threshold
  const isLargeTransaction = (tx: Transaction) => tx.amount > 1500;

  return (
    <Card className="col-span-full flex flex-col min-h-[600px] relative z-0">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Transactions</h3>
          <p className="text-sm text-text-secondary">View and filter your financial history precisely.</p>
        </div>
        
        {/* Advanced Filters Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex items-center gap-3 w-full xl:w-auto">
          {/* Search */}
          <div className="relative w-full lg:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search via syntax..." 
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setCurrentPage(1); }}
              className="input-base pl-9 py-2 text-sm w-full h-10"
            />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <input 
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="input-base py-2 px-3 text-sm h-10 w-36"
              title="Start Date"
            />
            <span className="text-text-tertiary">-</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="input-base py-2 px-3 text-sm h-10 w-36"
              title="End Date"
            />
          </div>

          {/* Category Filter */}
          <div className="relative w-full lg:w-36">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
             <select 
               value={filterCategory}
               onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
               className="input-base pl-9 py-2 text-sm h-10 w-full appearance-none capitalize cursor-pointer"
             >
               {uniqueCategories.map(cat => (
                 <option key={cat} value={cat}>{cat}</option>
               ))}
             </select>
          </div>
          
          {/* Income/Expense Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-lg border border-border h-10 w-full lg:w-auto overflow-hidden">
             {(['all', 'income', 'expense'] as const).map(type => (
               <button
                 key={type}
                 onClick={() => { setFilterType(type); setCurrentPage(1); }}
                 className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all duration-300 flex-1 lg:flex-none h-full ${
                   filterType === type ? 'bg-panel text-white shadow-sm border border-white/5' : 'text-text-secondary hover:text-white hover:bg-white/5'
                 }`}
               >
                 {type}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 min-h-[400px]">
        <table className="w-full text-sm text-left align-top relative">
          <thead className="text-xs text-text-secondary uppercase border-b border-border sticky top-0 bg-panel z-10 backdrop-blur-md">
             <tr>
               <th className="px-4 py-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('title')}>
                 <div className="flex items-center">Transaction <SortIcon field="title"/></div>
               </th>
               <th className="px-4 py-4 font-medium">Category</th>
               <th className="px-4 py-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('amount')}>
                 <div className="flex items-center">Amount <SortIcon field="amount"/></div>
               </th>
               <th className="px-4 py-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('date')}>
                 <div className="flex items-center">Date <SortIcon field="date"/></div>
               </th>
               <th className="px-4 py-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                 <div className="flex items-center">Status <SortIcon field="status"/></div>
               </th>
               {role === 'admin' && <th className="px-4 py-4 font-medium text-right">Actions</th>}
             </tr>
          </thead>
          <tbody>
            {isLoading ? (
               Array.from({ length: 8 }).map((_, i) => (
                 <tr key={i} className="border-b border-white/5 last:border-0">
                   <td className="px-4 py-4"><Skeleton className="h-10 w-full max-w-[200px]" /></td>
                   <td className="px-4 py-4"><Skeleton className="h-6 w-24" /></td>
                   <td className="px-4 py-4"><Skeleton className="h-6 w-20" /></td>
                   <td className="px-4 py-4"><Skeleton className="h-6 w-24" /></td>
                   <td className="px-4 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                   {role === 'admin' && <td className="px-4 py-4"><Skeleton className="h-6 w-8 ml-auto" /></td>}
                 </tr>
               ))
            ) : (
               <AnimatePresence mode="popLayout" initial={false}>
                 {paginatedTransactions.length === 0 ? (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      <td colSpan={role === 'admin' ? 6 : 5} className="py-24">
                        <EmptyState 
                          title="No Matching Transactions" 
                          description="Adjust your search filters, dates, or categories to find what you're looking for." 
                        />
                      </td>
                    </motion.tr>
                 ) : (
                   paginatedTransactions.map((tx) => {
                     const isHighlight = isLargeTransaction(tx);
                     return (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={tx.id} 
                        className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group relative ${isHighlight ? 'bg-primary/5' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl transition-colors text-text-secondary border ${
                               isHighlight ? 'bg-primary/10 text-primary border-primary/20' : 'bg-[#1A1A1A] group-hover:bg-panel group-hover:text-white border-transparent group-hover:border-white/10'
                            }`}>
                              {getCategoryIcon(tx.category)}
                            </div>
                            <div className="flex flex-col">
                               <span className="font-medium text-white flex items-center gap-2">
                                 {tx.title}
                                 {isHighlight && <span title="Large Transaction"><AlertCircle className="w-3.5 h-3.5 text-primary animate-pulse" /></span>}
                               </span>
                               {isHighlight && <span className="text-[10px] uppercase tracking-wider text-primary font-semibold mt-0.5">High Value</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                           <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#1A1A1A] text-text-secondary text-xs font-medium border border-white/5 shadow-inner">
                              {tx.category}
                           </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-semibold ${tx.type === 'income' ? 'text-success' : 'text-white'} ${isHighlight ? 'text-lg' : ''}`}>
                            {formatCurrency(tx.amount, tx.type)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-tertiary whitespace-nowrap">
                          {formatDateSegment(tx.date)}
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
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setEditingTx(tx); setIsModalOpen(true); }}
                                className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                title="Edit Transaction"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => { if(window.confirm('Are you sure you want to delete this transaction permanently?')) deleteTransaction(tx.id); }}
                                className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                title="Delete Transaction"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                     );
                   })
                 )}
               </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
         <p className="text-sm text-text-tertiary hidden sm:block">
            Showing <span className="text-white font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedTransactions.length) || 0}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}</span> of <span className="text-white font-medium">{filteredAndSortedTransactions.length}</span> results
         </p>
         
         <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-1.5 rounded-lg border border-border bg-[#1A1A1A] text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-secondary transition-all"
            >
               <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-sm text-text-secondary px-3">
               Page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white">{Math.max(1, totalPages)}</span>
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading || totalPages === 0}
              className="p-1.5 rounded-lg border border-border bg-[#1A1A1A] text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-secondary transition-all"
            >
               <ChevronRight className="w-4 h-4" />
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
