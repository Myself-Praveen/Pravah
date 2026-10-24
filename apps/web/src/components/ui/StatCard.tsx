import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  trend?: string;
}

const tones: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'bg-slate-50 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
  info: 'bg-indigo-50 text-indigo-700',
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, hint, icon: Icon, tone = 'default', trend }) => (
  <div className="card p-4 flex items-center justify-between gap-3 hover:shadow-elevated transition-shadow">
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-2xl font-black text-slate-900 mt-0.5 truncate">{value}</div>
      {hint && <div className="text-[11px] text-slate-500 mt-0.5 truncate">{hint}</div>}
      {trend && <div className="text-[10px] font-semibold text-emerald-600 mt-1">{trend}</div>}
    </div>
    {Icon && (
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
    )}
  </div>
);