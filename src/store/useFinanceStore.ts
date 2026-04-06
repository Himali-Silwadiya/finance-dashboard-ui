import { create } from 'zustand';
import type { Transaction, BalanceState, ChartDataPoint, CategoryDataPoint, ChartTimeRange } from '../types';

interface FinanceStore {
  balance: BalanceState;
  transactions: Transaction[];
  isLoading: boolean;
  
  // Analytics State
  chartTimeRange: ChartTimeRange;
  balanceHistory: ChartDataPoint[];
  expenseCategories: CategoryDataPoint[];
  
  // Auth State
  role: 'viewer' | 'admin';
  setRole: (role: 'viewer' | 'admin') => void;

  fetchData: () => Promise<void>;
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, updatedTx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setChartTimeRange: (range: ChartTimeRange) => void;
}

// Dummy initial data generator
const generateMockTransactions = (): Transaction[] => {
  const categories = ['Food', 'Salary', 'Subscriptions', 'Utilities', 'Shopping', 'Transport'];
  const titles = ['Whole Foods Market', 'Tech Corp Inc.', 'Netflix', 'Electric Bill', 'Amazon', 'Uber', 'Starbucks', 'Apple Store'];
  const statuses: ('completed' | 'pending')[] = ['completed', 'completed', 'completed', 'pending'];
  
  const txs: Transaction[] = [];
  const now = new Date();
  
  for (let i = 1; i <= 55; i++) {
    const isIncome = Math.random() > 0.8;
    const date = new Date(now);
    date.setDate(now.getDate() - Math.floor(Math.random() * 60)); // Random date in last 60 days
    
    txs.push({
      id: `tx-${i}`,
      type: isIncome ? 'income' : 'expense',
      amount: isIncome ? 500 + Math.random() * 4000 : 5 + Math.random() * 200,
      category: isIncome ? 'Salary' : categories[Math.floor(Math.random() * categories.length)],
      title: isIncome ? 'Tech Corp Inc.' : titles[Math.floor(Math.random() * titles.length)],
      date: date.toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  
  // Sort by date descending
  return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const MOCK_TRANSACTIONS = generateMockTransactions();

const MOCK_EXPENSE_CATEGORIES: CategoryDataPoint[] = [
  { name: 'Food & Dining', value: 450, color: '#3b82f6' },
  { name: 'Shopping', value: 300, color: '#8b5cf6' },
  { name: 'Transport', value: 150, color: '#10b981' },
  { name: 'Bills', value: 1149.20, color: '#ef4444' },
];

const generateMockChartData = (range: ChartTimeRange): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  const days = range === '1W' ? 7 : range === '1M' ? 30 : range === '6M' ? 180 : 365;
  
  let currentBalance = 12450.80 - (Math.random() * 2000);
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Simulate trend
    const change = (Math.random() - 0.45) * 150; 
    currentBalance += change;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: Number(currentBalance.toFixed(2))
    });
  }
  
  return data;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  balance: {
    totalBalance: 12450.80,
    totalIncome: 14500.00,
    totalExpense: 2049.20,
    percentageChange: +12.4,
  },
  transactions: [],
  isLoading: true,
  chartTimeRange: '1M',
  balanceHistory: generateMockChartData('1M'),
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  
  fetchData: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    set({ transactions: MOCK_TRANSACTIONS, isLoading: false });
  },
  
  setChartTimeRange: (range: ChartTimeRange) => {
    set({ 
      chartTimeRange: range,
      balanceHistory: generateMockChartData(range)
    });
  },
  
  role: 'admin', // Default to admin for demo
  setRole: (role) => set({ role }),
  
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
  updateTransaction: (id, updatedTx) => set((state) => ({
    transactions: state.transactions.map(tx => tx.id === id ? { ...tx, ...updatedTx } : tx)
  })),
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(tx => tx.id !== id)
  })),
}));
