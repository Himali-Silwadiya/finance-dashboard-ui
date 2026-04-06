import { FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ 
  title = "No results found", 
  description = "Try adjusting your filters or search terms.",
  icon = <FolderSearch className="w-12 h-12 text-text-tertiary/50" />
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full w-full">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-text-tertiary max-w-[250px] mx-auto">{description}</p>
    </div>
  );
};
