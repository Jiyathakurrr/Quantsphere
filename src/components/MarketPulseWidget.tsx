import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ChevronRight } from 'lucide-react';
import { MarketAsset } from '../types';
import { useAuth } from '../context/AuthContext';
import { TrendBadge } from './TrendBadge';

interface MarketPulseWidgetProps {
  assets: MarketAsset[];
}

export const MarketPulseWidget: React.FC<MarketPulseWidgetProps> = ({ assets }) => {
  const { formatCurrency } = useAuth();
  const topAssets = assets.slice(0, 5);

  return (
    <div
      id="market-pulse-widget"
      className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/10 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Market Pulse Watchlist
          </h3>
        </div>
        <Link
          to="/markets"
          id="market-pulse-all-link"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition-colors"
        >
          <span>All Markets</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800/60">
        {topAssets.map((asset) => (
          <Link
            key={asset.symbol}
            to={`/markets/${asset.symbol}`}
            id={`pulse-item-${asset.symbol.toLowerCase()}`}
            className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-800/40 px-1 rounded-lg transition-colors group cursor-pointer"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-xs group-hover:text-emerald-400 transition-colors">
                  {asset.symbol}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 px-1 py-0.2 rounded bg-slate-800/80">
                  {asset.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[120px] sm:max-w-[160px]">
                {asset.name}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="font-mono font-bold text-xs text-white">
                {formatCurrency(asset.price)}
              </span>
              <TrendBadge
                value={asset.changePercent24h}
                isPercent={true}
                size="sm"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
