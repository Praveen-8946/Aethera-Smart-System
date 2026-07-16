import React from 'react';
import * as Icons from 'lucide-react';

interface EmptyStateProps {
  message: string;
  icon?: keyof typeof Icons;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, icon = 'Inbox' }) => {
  const LucideIcon = Icons[icon] as React.ComponentType<any>;
  return (
    <div className="text-center py-12 px-6">
      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/5 text-gray-500">
        {LucideIcon && <LucideIcon className="w-6 h-6" />}
      </div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
};
