import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon = Inbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
      <Icon className="w-7 h-7 text-slate-400" />
    </div>
    <div className="text-sm font-bold text-slate-700">{title}</div>
    {description && <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="text-center space-y-2">
      <div className="w-9 h-9 border-4 border-aicte-accent border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  </div>
);