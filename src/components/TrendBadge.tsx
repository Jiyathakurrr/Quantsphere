import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface TrendBadgeProps {
  value: number;
  isPercent?: boolean;
  prefix?: string;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
  showZeroAsNeutral?: boolean;
  className?: string;
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({
  value,
  isPercent = false,
  prefix = '',
  suffix = '',
  size = 'md',
  showZeroAsNeutral = true,
  className = ''
}) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isZero = value === 0;

  const sign = isPositive ? '+' : isNegative ? '-' : '';
  const absVal = Math.abs(value);
  const formattedVal = isPercent 
    ? `${absVal.toFixed(2)}%`
    : `${absVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2 py-0.5 gap-1',
    lg: 'text-sm font-semibold px-2.5 py-1 gap-1.5'
  };

  const colorClasses = isPositive
    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    : isNegative
    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
    : 'bg-slate-800/60 text-slate-300 border border-slate-700/40';

  return (
    <span
      id={`trend-badge-${Math.random().toString(36).substring(2, 7)}`}
      className={`inline-flex items-center rounded-md font-mono whitespace-nowrap select-none ${sizeClasses[size]} ${colorClasses} ${className}`}
    >
      {isPositive && <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />}
      {isNegative && <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />}
      {isZero && <Minus className="w-3 h-3 text-slate-400" aria-hidden="true" />}
      <span>
        {sign}{prefix}{formattedVal}{suffix}
      </span>
    </span>
  );
};
