
import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';

export const BalanceCard = () => {
  const { balance, isLoading } = useFinanceStore();

  if (isLoading) {
    return <Card className="flex flex-col gap-4 h-40"><Skeleton className="h-8 w-1/3" /><Skeleton className="h-12 w-2/3" /></Card>;
  }

  const isPositive = balance.percentageChange >= 0;

  return (
    <Card hoverable className="glass-effect flex flex-col justify-between h-full bg-gradient-to-br from-panel to-[#111827]">
      <div className="flex justify-between items-start">
        <div className="text-text-secondary font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Total Balance
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${isPositive ? 'text-success bg-success/10' : 'text-danger bg-danger/10'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(balance.percentageChange)}%</span>
        </div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-4xl font-bold tracking-tight text-white mb-1">
          ${balance.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </h2>
        <p className="text-sm text-text-tertiary">vs last month</p>
      </div>
    </Card>
  );
};
