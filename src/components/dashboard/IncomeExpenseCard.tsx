
import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';
import { useFinanceStore } from '../../store/useFinanceStore';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const IncomeExpenseCard = ({ type }: { type: 'income' | 'expense' }) => {
  const { balance, isLoading } = useFinanceStore();

  if (isLoading) {
    return <Card className="h-40 flex flex-col justify-center gap-3"><Skeleton className="h-6 w-1/4" /><Skeleton className="h-8 w-1/2" /></Card>;
  }

  const isIncome = type === 'income';
  const amount = isIncome ? balance.totalIncome : balance.totalExpense;
  const label = isIncome ? 'Total Income' : 'Total Expense';
  const Icon = isIncome ? ArrowUpRight : ArrowDownRight;
  const colorClass = isIncome ? 'text-success' : 'text-white';
  const iconBg = isIncome ? 'bg-success/10' : 'bg-white/10';

  return (
    <Card hoverable className="flex flex-col justify-center h-full">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${iconBg} ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-text-secondary text-sm font-medium">{label}</p>
          <p className="text-2xl font-semibold text-white mt-1">
            ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </Card>
  );
};
