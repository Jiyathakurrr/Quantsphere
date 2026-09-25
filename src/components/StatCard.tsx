import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendBadge } from './TrendBadge';

interface StatCardProps {
  id?: string;
  title: string;
  value: string;
  subtitle?: string;
  trendValue?: number;
  isTrendPercent?: boolean;
  trendLabel?: string;
  sparklineData?: number[];
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight';
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  trendValue,
  isTrendPercent = true,
  trendLabel,
  sparklineData,
  icon,
  variant = 'default'
}) => {
  const isPositive = (trendValue ?? 0) >= 0;
  const sparklineColor = isPositive ? '#34d399' : '#f87171'; // emerald-400 or rose-400

  const chartData = sparklineData && sparklineData.length > 0 
    ? sparklineData.map((val, idx) => ({ i: idx, val }))
    : null;

  return (
    <div
      id={id || `stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-200 ${
        variant === 'highlight'
          ? 'bg-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
        {trendValue !== undefined ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <TrendBadge value={trendValue} isPercent={isTrendPercent} size="sm" />
            {trendLabel && (
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                {trendLabel}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Virtual Paper Funds</span>
        )}

        {/* Inline Minimal Sparkline */}
        {chartData && chartData.length > 1 && (
          <div className="w-20 h-7">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="val"
                  stroke={sparklineColor}
                  strokeWidth={1.75}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
