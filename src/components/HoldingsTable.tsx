import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircle, PieChart, TrendingUp, Layers } from 'lucide-react';
import { Holding } from '../types';
import { useAuth } from '../context/AuthContext';
import { TrendBadge } from './TrendBadge';
import { EmptyState } from './EmptyState';
import { TradeModal } from './TradeModal';

interface HoldingsTableProps {
  holdings: Holding[];
  onRefresh?: () => void;
  showFullDetails?: boolean;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  onRefresh,
  showFullDetails = false
}) => {
  const { formatCurrency } = useAuth();
  const [tradeSymbol, setTradeSymbol] = useState<string | null>(null);

  if (!holdings || holdings.length === 0) {
    return (
      <EmptyState
        id="holdings-empty-state"
        icon={PieChart}
        title="No holdings in portfolio yet"
        description="You currently hold 0 asset positions. Use your virtual funds to execute simulated market orders across top equities and indices."
        actionText="Browse Markets & Assets"
        actionHref="/markets"
      />
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/60 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/80 uppercase font-semibold text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3.5">Asset</th>
              <th scope="col" className="px-4 py-3.5 text-right">Shares</th>
              <th scope="col" className="px-4 py-3.5 text-right">Avg Price</th>
              <th scope="col" className="px-4 py-3.5 text-right">Current Price</th>
              <th scope="col" className="px-4 py-3.5 text-right">Market Value</th>
              <th scope="col" className="px-4 py-3.5 text-right">Unrealized P&L</th>
              {showFullDetails && (
                <th scope="col" className="px-4 py-3.5 text-right hidden sm:table-cell">Allocation</th>
              )}
              <th scope="col" className="px-4 py-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {holdings.map((holding) => (
              <tr
                key={holding.symbol}
                id={`holding-row-${holding.symbol.toLowerCase()}`}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {/* Asset Symbol & Name */}
                <td className="px-4 py-3.5">
                  <Link
                    to={`/markets/${holding.symbol}`}
                    className="flex flex-col group-hover:text-emerald-400 transition-colors"
                  >
                    <span className="font-bold text-white text-sm">
                      {holding.symbol}
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans truncate max-w-[140px] sm:max-w-[200px]">
                      {holding.name}
                    </span>
                  </Link>
                </td>

                {/* Shares */}
                <td className="px-4 py-3.5 text-right font-medium text-slate-200">
                  {holding.shares.toLocaleString()}
                </td>

                {/* Avg Buy Price */}
                <td className="px-4 py-3.5 text-right text-slate-300">
                  {formatCurrency(holding.avgBuyPrice)}
                </td>

                {/* Current Market Price */}
                <td className="px-4 py-3.5 text-right font-semibold text-white">
                  {formatCurrency(holding.currentPrice)}
                </td>

                {/* Total Value */}
                <td className="px-4 py-3.5 text-right font-bold text-white">
                  {formatCurrency(holding.totalValue)}
                </td>

                {/* Unrealized P&L with strict +/- and icon */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <TrendBadge
                      value={holding.unrealizedPnL}
                      prefix={holding.unrealizedPnL >= 0 ? '+' : '-'}
                      size="sm"
                    />
                    <TrendBadge
                      value={holding.unrealizedPnLPercent}
                      isPercent={true}
                      size="sm"
                    />
                  </div>
                </td>

                {/* Allocation % */}
                {showFullDetails && (
                  <td className="px-4 py-3.5 text-right text-slate-400 hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${Math.min(holding.allocationPercent, 100)}%` }}
                        />
                      </div>
                      <span>{holding.allocationPercent.toFixed(1)}%</span>
                    </div>
                  </td>
                )}

                {/* Action CTA */}
                <td className="px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      id={`trade-btn-${holding.symbol.toLowerCase()}`}
                      type="button"
                      onClick={() => setTradeSymbol(holding.symbol)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[11px] font-sans font-semibold transition-all cursor-pointer"
                    >
                      Trade
                    </button>
                    <Link
                      to={`/markets/${holding.symbol}`}
                      className="p-1 rounded text-slate-500 hover:text-white transition-colors"
                      title="View Details"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tradeSymbol && (
        <TradeModal
          isOpen={!!tradeSymbol}
          defaultSymbol={tradeSymbol}
          onClose={() => setTradeSymbol(null)}
          onOrderSuccess={() => {
            setTradeSymbol(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </>
  );
};
