import { ShoppingBag, Briefcase, Zap, HelpCircle } from 'lucide-react';

export const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': return <ShoppingBag className="w-5 h-5 flex-shrink-0" />;
    case 'salary': return <Briefcase className="w-5 h-5 flex-shrink-0" />;
    case 'utilities': return <Zap className="w-5 h-5 flex-shrink-0" />;
    default: return <HelpCircle className="w-5 h-5 flex-shrink-0" />;
  }
};
