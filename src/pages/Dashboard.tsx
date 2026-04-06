import { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { IncomeExpenseCard } from '../components/dashboard/IncomeExpenseCard';
import { TransactionModal } from '../components/dashboard/TransactionModal';
import { useFinanceStore } from '../store/useFinanceStore';
import type { Transaction } from '../types';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { ArrowRight, Plus, Download } from 'lucide-react';
import { downloadTransactionsCsv } from '../utils/exportCsv';

export const Dashboard = () => {
  const { transactions, fetchData, isLoading, role, addTransaction } = useFinanceStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PageWrapper>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back, Alex</h1>
          <p className="text-text-secondary">Here's what's happening with your finances today.</p>
        </div>
        <div className="flex gap-4">
          {role === 'admin' && (
            <button 
              onClick={() => downloadTransactionsCsv(transactions)}
              className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-white font-medium transition-colors border border-border mt-4"
            >
              <Download className="w-5 h-5" />
              Download Report
            </button>
          )}
          {role === 'admin' && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-medium transition-colors shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <BalanceCard />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <IncomeExpenseCard type="income" />
          <IncomeExpenseCard type="expense" />
        </div>
        <Card hoverable className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#1A1A1A] to-panel">
          <div>
            <h3 className="text-white font-semibold mb-2">Quick Transfer</h3>
            <p className="text-sm text-text-tertiary">Send money to your recent contacts</p>
          </div>
          
          <div className="flex gap-3 my-6">
            {isLoading ? (
               Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-12 h-12 rounded-full" />)
            ) : (
               Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-border overflow-hidden border-2 border-transparent hover:border-primary transition-colors cursor-pointer">
                  <img src={`https://ui-avatars.com/api/?name=${i}&background=random`} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))
            )}
          </div>
          
          <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors text-sm">
            See all contacts <ArrowRight className="w-4 h-4" />
          </button>
        </Card>
      </div>

      <TransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={(tx) => addTransaction({ ...tx, id: `tx-${Date.now()}` } as Transaction)} 
      />
    </PageWrapper>
  );
};
