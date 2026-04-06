export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  title: string;
  status: 'completed' | 'pending';
}

export interface BalanceState {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  percentageChange: number; // positive or negative
}

export interface ChartDataPoint {
  date: string;
  balance: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

export type ChartTimeRange = '1W' | '1M' | '6M' | '1Y';
