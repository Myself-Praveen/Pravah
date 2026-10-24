import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, description, actions, badge }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
    <div className="min-w-0">
      {eyebrow && (
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-aicte-accent bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            {eyebrow}
          </span>
          {badge && <span className="text-xs text-slate-400">• {badge}</span>}
        </div>
      )}
      <h1 className="page-header-title">{title}</h1>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-2xl">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);