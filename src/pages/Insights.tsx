import { PageWrapper } from '../components/layout/PageWrapper';
import { AnalyticsCharts } from '../components/dashboard/AnalyticsCharts';
import { InsightsPanel } from '../components/dashboard/InsightsPanel';

export const Insights = () => {
  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Financial Insights</h1>
        <p className="text-text-secondary">AI-driven analysis and interactive charts mapping your financial health.</p>
      </div>
      
      <InsightsPanel />
      <AnalyticsCharts />
    </PageWrapper>
  );
};
