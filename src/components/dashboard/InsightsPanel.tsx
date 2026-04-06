import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';
import { useInsights, type Insight } from '../../hooks/useInsights';
import { Lightbulb, TrendingDown, TrendingUp, AlertTriangle, Sparkles, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const getInsightIcon = (type: Insight['type']) => {
  switch (type) {
    case 'positive': return <TrendingDown className="w-5 h-5 text-success" />;
    case 'negative': return <AlertTriangle className="w-5 h-5 text-danger" />;
    case 'warning': return <TrendingUp className="w-5 h-5 text-amber-500" />;
    default: return <Lightbulb className="w-5 h-5 text-primary" />;
  }
};

const getInsightColors = (type: Insight['type']) => {
  switch (type) {
    case 'positive': return 'bg-success/5 border-success/30';
    case 'negative': return 'bg-danger/5 border-danger/30';
    case 'warning': return 'bg-amber-500/5 border-amber-500/30';
    default: return 'bg-primary/5 border-primary/30';
  }
};

const renderDescription = (text: string) => {
  // Simple bold markdown renderer for smart assistant text
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

export const InsightsPanel = () => {
  const { insights, isLoading } = useInsights();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         {Array.from({ length: 3 }).map((_, i) => (
           <Card key={i} className="h-32 p-5"><Skeleton className="h-full w-full" /></Card>
         ))}
      </div>
    );
  }

  if (insights.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 mb-4">
         <Sparkles className="w-5 h-5 text-primary" />
         <h3 className="text-white text-lg font-semibold">AI Financial Insights</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-default">
        {insights.map((insight) => (
          <Card 
            key={insight.id} 
            hoverable
            className={`flex flex-col justify-between border ${getInsightColors(insight.type)} transition-colors backdrop-blur-xl relative overflow-hidden`}
          >
             {/* Decorative glow */}
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
             
            <div className="flex items-start gap-4 z-10">
              <div className="p-2.5 rounded-lg bg-[#1A1A1A] border border-white/5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  {insight.title}
                  {insight.type === 'negative' && <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-danger/20 text-danger border border-danger/20">Alert</span>}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {renderDescription(insight.description)}
                </p>
              </div>
            </div>
            
            {insight.metrics && (
              <div className="flex items-end gap-6 mt-6 z-10 pt-4 border-t border-white/10">
                {insight.metrics.map((metric, index) => (
                  <div key={index} className="flex flex-col">
                    <p className="text-[11px] text-text-tertiary mb-1 uppercase tracking-wider font-medium">{metric.label}</p>
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xl font-semibold tracking-tight ${insight.type === 'positive' && index === 0 ? 'text-success' : 'text-white'}`}>
                        {metric.value}
                      </p>
                      {metric.trend && (
                        <div className={`p-1 rounded-full ${
                          metric.trend === 'up' && insight.type === 'warning' ? 'bg-amber-500/20 text-amber-500' :
                          metric.trend === 'up' && insight.type === 'negative' ? 'bg-danger/20 text-danger' :
                          metric.trend === 'down' && insight.type === 'positive' ? 'bg-success/20 text-success' :
                          'bg-white/10 text-text-secondary'
                        }`}>
                          {metric.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : 
                           metric.trend === 'down' ? <ArrowDownRight className="w-3.5 h-3.5" /> : 
                           <Minus className="w-3 h-3" />}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
