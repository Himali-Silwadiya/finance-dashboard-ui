import { PageWrapper } from '../components/layout/PageWrapper';
import { TransactionTable } from '../components/dashboard/TransactionTable';

export const Transactions = () => {
  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Transactions</h1>
        <p className="text-text-secondary">View, manage, and track your financial operations.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <TransactionTable />
      </div>
    </PageWrapper>
  );
};
