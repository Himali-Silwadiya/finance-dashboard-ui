import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export interface Insight {
  id: string;
  type: 'neutral' | 'positive' | 'negative' | 'warning';
  title: string;
  description: string;
  metrics?: { label: string; value: string }[];
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
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0];
    
    if (topCategory) {
      generatedInsights.push({
        id: 'insight-top-category',
        type: 'warning',
        title: 'Highest Spending Category',
        description: `You've spent the most on ${topCategory[0]} recently.`,
        metrics: [{ label: 'Total Amount', value: `$${topCategory[1].toFixed(2)}` }]
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
          description: `We noticed a larger-than-normal transaction for ${anomalies[0].title}.`,
          metrics: [
            { label: 'Amount', value: `$${anomalies[0].amount.toFixed(2)}` },
            { label: 'Date', value: new Date(anomalies[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }
          ]
        });
      } else {
         generatedInsights.push({
            id: 'insight-consistent',
            type: 'positive',
            title: 'Consistent Spending Habits',
            description: `Your transaction sizes are well within your typical average range. Keep it up!`,
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
      
      generatedInsights.push({
        id: 'insight-mom',
        type: isGood ? 'positive' : 'negative',
        title: 'Month-over-Month Comparison',
        description: isGood 
          ? `Great job! Your spending is down compared to last month.`
          : `You spent more this month compared to the last 30 days.`,
        metrics: [
          { label: 'Trend', value: `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%` },
          { label: 'This Month', value: `$${thisMonthTotal.toFixed(0)}` }
        ]
      });
    }

    return generatedInsights;
  }, [transactions, isLoading]);

  return { insights, isLoading };
};
