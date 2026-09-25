import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { Holding } from '../types';
import { useAuth } from '../context/AuthContext';

interface AllocationChartProps {
  holdings: Holding[];
  availableCash: number;
}

const COLORS = [
  '#10b981', // emerald-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#64748b'  // slate-500
];

export const AllocationChart: React.FC<AllocationChartProps> = ({
  holdings,
  availableCash
}) => {
  const { formatCurrency } = useAuth();

  const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0) + availableCash;

  const data = [
    ...holdings.map((h, i) => ({
      name: h.symbol,
      value: h.totalValue,
      color: COLORS[i % COLORS.length]
    })),
    {
      name: 'Cash (Unallocated)',
      value: availableCash,
      color: '#475569' // slate-600
    }
  ].filter(d => d.value > 0);

  if (data.length === 0) return null;

  return (
    <div
      id="portfolio-allocation-card"
      className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-teal-500/10 text-teal-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Portfolio Allocation
          </h3>
        </div>
        <span className="font-mono text-xs text-slate-400">
          Total: {formatCurrency(totalValue)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
        {/* Pie Canvas */}
        <div className="sm:col-span-6 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    const pct = totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : '0.0';
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs font-mono shadow-lg">
                        <span className="font-bold text-white">{d.name}</span>
                        <div className="text-emerald-400 mt-0.5">
                          {formatCurrency(d.value)} ({pct}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend List */}
        <div className="sm:col-span-6 space-y-2 font-mono text-xs">
          {data.map((item) => {
            const pct = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0';
            return (
              <div key={item.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 truncate max-w-[100px]">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
