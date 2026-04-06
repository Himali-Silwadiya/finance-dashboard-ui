
import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';
import { useFinanceStore } from '../../store/useFinanceStore';
import { ShoppingBag, Briefcase, Zap, HelpCircle } from 'lucide-react';

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': return <ShoppingBag className="w-5 h-5" />;
    case 'salary': return <Briefcase className="w-5 h-5" />;
    case 'utilities': return <Zap className="w-5 h-5" />;
    default: return <HelpCircle className="w-5 h-5" />;
  }
};

export const TransactionList = () => {
  const { transactions, isLoading } = useFinanceStore();

  return (
    <Card className="flex-1 col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
        <button className="text-primary hover:text-blue-400 text-sm font-medium transition-colors">View All</button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2"><Skeleton className="h-10 w-full" /></div>
          ))
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-[#1A1A1A] text-text-secondary group-hover:text-white transition-colors">
                  {getCategoryIcon(tx.category)}
                </div>
                <div>
                  <p className="text-white font-medium">{tx.title}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{tx.date} • {tx.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.type === 'income' ? 'text-success' : 'text-white'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </p>
                <p className={`text-xs mt-0.5 capitalize ${tx.status === 'pending' ? 'text-amber-500' : 'text-text-tertiary'}`}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
