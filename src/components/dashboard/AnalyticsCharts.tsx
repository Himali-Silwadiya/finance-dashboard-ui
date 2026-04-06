import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';
import { useFinanceStore } from '../../store/useFinanceStore';
import type { ChartTimeRange } from '../../types';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export const AnalyticsCharts = () => {
  const { balanceHistory, expenseCategories, chartTimeRange, setChartTimeRange, isLoading } = useFinanceStore();
  const ranges: ChartTimeRange[] = ['1W', '1M', '6M', '1Y'];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 h-[400px] flex flex-col justify-center px-6 gap-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="flex-1 w-full" />
        </Card>
        <Card className="col-span-1 h-[400px] flex flex-col justify-center px-6 gap-4">
           <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
           <Skeleton className="h-48 w-48 rounded-full mx-auto" />
        </Card>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1A] border border-border p-3 rounded-lg shadow-xl shadow-black/50">
          <p className="text-text-tertiary text-xs mb-1">{label}</p>
          <p className="text-white font-semibold flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-primary" />
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1A1A1A] border border-border p-3 rounded-lg shadow-xl shadow-black/50">
          <p className="text-white font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            {data.name}
          </p>
          <p className="text-text-secondary text-sm mt-1">
            ${data.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Area Chart: Balance Trend */}
      <Card className="lg:col-span-2 relative h-[420px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-white text-lg font-semibold">Balance Trend</h3>
            <p className="text-text-secondary text-sm">Your cash flow over time</p>
          </div>
          <div className="flex bg-[#1A1A1A] border border-border rounded-lg p-1">
            {ranges.map(range => (
              <button
                key={range}
                onClick={() => setChartTimeRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  chartTimeRange === range 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceHistory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222222" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickMargin={12}
                minTickGap={30}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Pie Chart: Expense Breakdown */}
      <Card className="col-span-1 h-[420px] flex flex-col">
          <div className="mb-2">
            <h3 className="text-white text-lg font-semibold">Spending by Category</h3>
          </div>
          
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                   verticalAlign="bottom" 
                   height={36}
                   content={(props) => {
                     const { payload } = props;
                     return (
                       <ul className="flex flex-wrap justify-center gap-4 text-xs mt-4">
                         {payload?.map((entry: any, index: number) => (
                           <li key={`item-${index}`} className="flex items-center text-text-secondary">
                             <span 
                               className="w-2 h-2 rounded-full mr-2" 
                               style={{ backgroundColor: entry.color }} 
                             />
                             {entry.value}
                           </li>
                         ))}
                       </ul>
                     );
                   }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+18px)] text-center pointer-events-none">
               <p className="text-text-tertiary text-xs">Total Expense</p>
               <p className="text-xl font-bold text-white mt-0.5">
                  ${expenseCategories.reduce((acc, curr) => acc + curr.value, 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}
               </p>
            </div>
          </div>
      </Card>
    </div>
  );
};
