import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PriceChartProps {
  id?: string;
  title: string;
  subtitle?: string;
  data: { time: string; value: number }[];
  timeframe: string;
  onTimeframeChange?: (tf: string) => void;
  timeframeOptions?: string[];
  height?: number;
  emptyLabel?: string;
  color?: string;
  headerRightContent?: React.ReactNode;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  id,
  title,
  subtitle,
  data,
  timeframe,
  onTimeframeChange,
  timeframeOptions = ['1D', '1W', '1M', 'ALL'],
  height = 320,
  emptyLabel = 'Start trading to see your equity curve',
  color = '#10b981', // emerald-500
  headerRightContent
}) => {
  const { formatCurrency } = useAuth();
  const [hoveredData, setHoveredData] = useState<{ time: string; value: number } | null>(null);

  const hasData = data && data.length > 1;
  const latestValue = hasData ? data[data.length - 1].value : 0;
  const firstValue = hasData ? data[0].value : 0;
  const periodChange = latestValue - firstValue;
  const periodChangePercent = firstValue > 0 ? (periodChange / firstValue) * 100 : 0;
  const isPositive = periodChange >= 0;

  // Min and max for domain
  const values = hasData ? data.map(d => d.value) : [0, 100];
  const minVal = Math.min(...values) * 0.995;
  const maxVal = Math.max(...values) * 1.005;

  return (
    <div
      id={id || 'price-chart-card'}
      className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-4"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              {title}
            </h3>
            {subtitle && (
              <span className="text-xs text-slate-400 font-medium">({subtitle})</span>
            )}
          </div>
          {hasData && (
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-white">
                {hoveredData ? formatCurrency(hoveredData.value) : formatCurrency(latestValue)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {hoveredData ? hoveredData.time : `Current`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {headerRightContent}

          {onTimeframeChange && (
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
              {timeframeOptions.map((tf) => (
                <button
                  key={tf}
                  id={`chart-tf-${tf.toLowerCase()}`}
                  type="button"
                  onClick={() => onTimeframeChange(tf)}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full" style={{ height: `${height}px` }}>
        {!hasData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 rounded-lg border border-dashed border-slate-800/80">
            <BarChart2 className="w-10 h-10 text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-400 max-w-xs">
              {emptyLabel}
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              onMouseMove={(e: any) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  setHoveredData(e.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setHoveredData(null)}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={6}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[minVal, maxVal]}
                tickFormatter={(v) => {
                  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
                  if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
                  return v;
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 shadow-xl font-mono text-xs">
                        <div className="text-slate-400 text-[10px]">{d.time}</div>
                        <div className="font-bold text-emerald-400 text-sm mt-0.5">
                          {formatCurrency(d.value)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#chartGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
