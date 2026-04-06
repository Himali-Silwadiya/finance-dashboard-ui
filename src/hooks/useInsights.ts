import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export interface Insight {
  id: string;
  type: 'neutral' | 'positive' | 'negative' | 'warning';
  title: string;
  description: string;
  metrics?: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
}

export const useInsights = () => {
  const { transactions, isLoading } = useFinanceStore();

  const insights = useMemo(() => {
    if (isLoading || transactions.length === 0) return [];

    const generatedInsights: Insight[] = [];
    
    // Separate into expenses and incomes
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // 1. Highest Spending Category
    const categoryTotals: Record<string, number> = {};
    let totalExpenseAmount = 0;
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      totalExpenseAmount += t.amount;
    });
    
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0];
    
    if (topCategory && totalExpenseAmount > 0) {
      const percentage = ((topCategory[1] / totalExpenseAmount) * 100).toFixed(0);
      generatedInsights.push({
        id: 'insight-top-category',
        type: 'warning',
        title: 'Spending Hotspot',
        description: `**${topCategory[0]}** is your highest spending category this period, making up **${percentage}%** of your total expenses.`,
        metrics: [{ label: 'Category Total', value: `$${topCategory[1].toFixed(0)}`, trend: 'up' }]
      });
    }

    // 2. Spending Anomalies (Single large transactions)
    if (expenses.length > 0) {
      const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      const avgExpense = totalExpense / expenses.length;
      
      const anomalies = expenses.filter(t => t.amount > avgExpense * 3); // 3x the average
      
      if (anomalies.length > 0) {
        generatedInsights.push({
          id: 'insight-anomaly',
          type: 'negative',
          title: 'Unusual Spending Detected',
          description: `I noticed a very large charge for **${anomalies[0].title}**. This is 3x higher than your usual average.`,
          metrics: [
            { label: 'Amount', value: `$${anomalies[0].amount.toFixed(0)}`, trend: 'up' },
            { label: 'Date', value: new Date(anomalies[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }
          ]
        });
      } else {
         generatedInsights.push({
            id: 'insight-consistent',
            type: 'positive',
            title: 'Consistent Habits',
            description: `Great job! Your spending is highly consistent with no major outlier charges detected this period.`,
         });
      }
    }

    // 3. Simple Month-over-Month logic (mock approximation via date comparison)
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(now.getDate() - 60);

    const thisMonthExpenses = expenses.filter(t => new Date(t.date) >= thirtyDaysAgo);
    const lastMonthExpenses = expenses.filter(t => {
      const d = new Date(t.date);
      return d < thirtyDaysAgo && d >= sixtyDaysAgo;
    });

    const thisMonthTotal = thisMonthExpenses.reduce((a, b) => a + b.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((a, b) => a + b.amount, 0);

    // Provide insight depending on MoM
    if (lastMonthTotal > 0) {
      const percentageChange = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      const isGood = percentageChange <= 0; // Less expenses is good
      const absChange = Math.abs(percentageChange).toFixed(1);
      
      generatedInsights.push({
        id: 'insight-mom',
        type: isGood ? 'positive' : 'warning',
        title: 'Monthly Trajectory',
        description: isGood 
          ? `You spent **${absChange}% less** this month compared to your previous 30 days. Excellent budgeting!`
          : `You spent **${absChange}% more** this month than your previous 30 days. Let's keep an eye on this.`,
        metrics: [
          { label: 'Variance', value: `${isGood ? '-' : '+'}${absChange}%`, trend: isGood ? 'down' : 'up' },
          { label: 'This Month', value: `$${thisMonthTotal.toFixed(0)}` }
        ]
      });
    }

    return generatedInsights;
  }, [transactions, isLoading]);

  return { insights, isLoading };
};
