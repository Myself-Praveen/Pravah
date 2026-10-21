import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Flame, PauseCircle } from 'lucide-react';
import { SlaState } from '@pravah/shared';

interface SlaBadgeProps {
  state: SlaState;
  pct?: number;
  className?: string;
  showIcon?: boolean;
}

export const SlaBadge: React.FC<SlaBadgeProps> = ({ state, pct, className = '', showIcon = true }) => {
  const configs = {
    GREEN: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />,
      label: 'On Schedule (Green)',
    },
    AMBER: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline mr-1" />,
      label: 'Warning (Amber)',
    },
    RED: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600 inline mr-1" />,
      label: 'SLA Breached (Red)',
    },
    CRITICAL: {
      bg: 'bg-red-100 text-red-950 border-red-300 font-semibold animate-pulse',
      icon: <Flame className="w-3.5 h-3.5 text-red-600 inline mr-1" />,
      label: 'Critical Delay (>=125%)',
    },
    PAUSED: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <PauseCircle className="w-3.5 h-3.5 text-blue-600 inline mr-1" />,
      label: 'Clock Paused (With Institution)',
    },
  };

  const c = configs[state] || configs.GREEN;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border font-medium ${c.bg} ${className}`}
      role="status"
      aria-label={`SLA status: ${c.label}`}
    >
      {showIcon && c.icon}
      <span>{c.label}</span>
      {pct !== undefined && <span className="ml-1 opacity-75">({pct}%)</span>}
    </span>
  );
};
