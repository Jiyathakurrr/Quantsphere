import React from 'react';
import { Link } from 'react-router-dom';
import { History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction } from '../types';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from './EmptyState';

interface TransactionTableProps {
  transactions: Transaction[];
  limit?: number;
  showViewAll?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  limit,
  showViewAll = false
}) => {
  const { formatCurrency } = useAuth();
  const displayTxs = limit ? transactions.slice(0, limit) : transactions;

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        id="transactions-empty-state"
        icon={History}
        title="No simulated transactions yet"
        description="All your buy/sell orders, algorithmic strategy triggers, and test executions will be logged here."
        actionText="Execute First Trade"
        actionHref="/markets"
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/60 shadow-sm">
      <table className="w-full text-left text-xs font-mono">
        <thead className="border-b border-slate-800 bg-slate-950/80 uppercase font-semibold text-slate-400 font-sans">
          <tr>
            <th scope="col" className="px-4 py-3.5">Timestamp</th>
            <th scope="col" className="px-4 py-3.5">Type</th>
            <th scope="col" className="px-4 py-3.5">Asset</th>
            <th scope="col" className="px-4 py-3.5 text-right">Shares</th>
            <th scope="col" className="px-4 py-3.5 text-right">Price</th>
            <th scope="col" className="px-4 py-3.5 text-right">Total</th>
            <th scope="col" className="px-4 py-3.5 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {displayTxs.map((tx) => (
            <tr
              key={tx.id}
              id={`tx-row-${tx.id}`}
              className="hover:bg-slate-800/40 transition-colors"
            >
              {/* Date */}
              <td className="px-4 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                {tx.timestamp}
              </td>

              {/* Type pill with icon */}
              <td className="px-4 py-3.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    tx.type === 'BUY'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {tx.type === 'BUY' ? (
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                  )}
                  <span>{tx.type}</span>
                </span>
              </td>

              {/* Asset */}
              <td className="px-4 py-3.5">
                <Link
                  to={`/markets/${tx.symbol}`}
                  className="font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  {tx.symbol}
                </Link>
              </td>

              {/* Shares */}
              <td className="px-4 py-3.5 text-right text-slate-200">
                {tx.shares.toLocaleString()}
              </td>

              {/* Price */}
              <td className="px-4 py-3.5 text-right text-slate-300">
                {formatCurrency(tx.price)}
              </td>

              {/* Total */}
              <td className="px-4 py-3.5 text-right font-bold text-white">
                {formatCurrency(tx.total)}
              </td>

              {/* Status */}
              <td className="px-4 py-3.5 text-center">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showViewAll && (
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-center">
          <Link
            to="/transactions"
            id="tx-view-all-link"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View Complete Transaction History →
          </Link>
        </div>
      )}
    </div>
  );
};
